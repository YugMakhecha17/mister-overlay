from __future__ import annotations

import os
from typing import Any, Dict, List, Optional, Tuple, Union

import cv2
import numpy as np

from interactive_overlay import (
    InteractiveTextOverlay,
    pick_modern_sans,
)
from vision import infer_saliency, edge_map_gray, local_variance
from advanced_layout import analyze_image_regions
from font_manager import FontManager, TextStyleConfig, get_font_recommendations


BGRImage = np.ndarray  # HxWx3 uint8


class TextOverlayAPI:
    """High-level, non-CLI API for TextOverlay.

    Provides programmatic access to the pipeline that powers
    `interactive_overlay.py`, including analysis, style suggestions,
    and final rendering.
    """

    def __init__(self, weights: Optional[str] = "u2net.pth", device: str = "cpu") -> None:
        # Reuse the mature implementation in InteractiveTextOverlay
        self._core = InteractiveTextOverlay(model_weights=weights)
        self._font_mgr = self._core.font_manager
        self._device = device

    # ---------- Analysis ----------
    def analyze_image(self, image: Union[str, BGRImage], text: str) -> Dict[str, Any]:
        """Analyze an image and return placement options and feature maps.

        Args:
            image: Path to image or BGR ndarray (HxWx3, uint8).
            text: The text string to be placed (used for estimating box sizes).
        Returns:
            Dict with keys: 'image' (BGR np.ndarray), 'saliency', 'edge_map',
            'var_map', 'placement_options', 'text'. Compatible with
            InteractiveTextOverlay methods.
        """
        img_bgr = self._to_bgr(image)
        if img_bgr is None:
            raise ValueError("Could not load image. Provide a valid path or BGR ndarray.")

        sal_map = infer_saliency(self._core.model, img_bgr, device=self._device, target_size=(320, 320))
        edge = edge_map_gray(img_bgr)
        var = local_variance(img_bgr, ksize=15)
        placement = analyze_image_regions(img_bgr, sal_map, edge, var, text)
        return {
            "image": img_bgr,
            "saliency": sal_map,
            "edge_map": edge,
            "var_map": var,
            "placement_options": placement,
            "text": text,
        }

    # ---------- Suggestions ----------
    def suggest_styles(self, analysis: Dict[str, Any], position: str, top_k: int = 6) -> List[TextStyleConfig]:
        """Suggest tasteful styles for a given position based on its background.

        Args:
            analysis: Result from analyze_image().
            position: One of the placement keys (e.g., 'left', 'center', ... or 'custom').
            top_k: Max number of styles to return.
        """
        option = analysis.get("placement_options", {}).get(position)
        if not option:
            raise ValueError(f"No placement option found for position '{position}'.")
        bg_color = option["bg_color"]
        recs = get_font_recommendations(bg_color)
        return recs[:top_k]

    def build_style_config(
        self,
        font_name: Optional[str],
        font_size: int,
        bg_color: Tuple[int, int, int],
        text_color_name: Optional[str] = None,
        opacity: float = 0.9,
        blend_mode: str = "overlay",
        shadow: bool = True,
    ) -> TextStyleConfig:
        """Build a style config honoring color-name-only preference.

        If text_color_name is None, an auto-contrasting curated color will be chosen.
        """
        # Resolve font
        name = font_name or pick_modern_sans(self._font_mgr)
        # Resolve color name to RGB (or None for auto)
        rgb = self._font_mgr.validate_color(text_color_name) if text_color_name else None
        return self._core.build_style_config(
            name, int(font_size), bg_color, rgb, opacity=opacity, blend_mode=blend_mode, shadow=shadow
        )

    # ---------- Rendering ----------
    def render_overlay(
        self,
        analysis: Dict[str, Any],
        position: str,
        text: Optional[str] = None,
        style: Union[TextStyleConfig, Dict[str, Any], None] = None,
        output_path: Optional[str] = None,
        behind_subject: Union[bool, str] = "auto",
    ) -> BGRImage:
        """Render the final image.

        Args:
            analysis: Result from analyze_image().
            position: placement key ('left', 'center', 'right', 'center_left', 'bottom_right', 'custom', ...).
            text: Text to overlay; defaults to analysis['text'].
            style: TextStyleConfig or dict compatible with TextStyleConfig.from_dict.
            output_path: If provided, image is saved.
            behind_subject: True/False, or 'auto' to enable only if subject present in region.
        Returns:
            Final image (BGR ndarray).
        """
        text = text if text is not None else analysis.get("text", "")
        option = analysis.get("placement_options", {}).get(position)
        if not option:
            raise ValueError(f"No placement option found for position '{position}'.")

        # Normalize style
        if style is None:
            # Sensible default based on background
            styles = self.suggest_styles(analysis, position, top_k=1)
            style_cfg = styles[0] if styles else TextStyleConfig()
        elif isinstance(style, TextStyleConfig):
            style_cfg = style
        else:
            style_cfg = TextStyleConfig.from_dict(style)

        # Decide 'behind' behavior
        use_behind = False
        sal = analysis.get("saliency")
        if isinstance(behind_subject, str) and behind_subject.lower() == "auto":
            use_behind = self._auto_behind(sal, option.get("box"))
        else:
            use_behind = bool(behind_subject)

        out_path = output_path or "final_overlay.png"
        # Apply the text overlay to the image
        result = self._core.create_final_overlay(
            analysis["image"], option["box"], text, style_cfg, output_path, saliency=sal, behind_subject=use_behind
        )
        return result

    # ---------- Convenience end-to-end ----------
    def run(
        self,
        image: Union[str, BGRImage],
        text: str,
        preferred_area: Optional[str] = None,
        font_family: Optional[str] = None,
        font_size: Optional[int] = None,
        text_color_name: Optional[str] = None,
        opacity: float = 0.9,
        blend: str = "overlay",
        shadow: bool = True,
        output_path: str = "final_overlay.png",
        behind_subject: Union[bool, str] = "auto",
    ) -> BGRImage:
        """One-call non-interactive flow.

        Uses recommended font-size for the chosen area if not provided.
        """
        analysis = self.analyze_image(image, text)
        placement = analysis["placement_options"]
        pos = self._pick_position(placement, preferred_area)
        opt = placement[pos]
        rec_size = int(opt.get("recommended_font_size", 24))
        W, H = analysis["image"].shape[1], analysis["image"].shape[0]
        cap = max(16, int(min(W, H) * 0.05))
        size = int(font_size or min(rec_size, cap))
        style_cfg = self.build_style_config(
            font_family, size, opt["bg_color"], text_color_name, opacity=opacity, blend_mode=blend, shadow=shadow
        )
        return self.render_overlay(
            analysis, pos, text=text, style=style_cfg, output_path=output_path, behind_subject=behind_subject
        )

    # ---------- Helpers ----------
    def _to_bgr(self, image: Union[str, BGRImage]) -> Optional[BGRImage]:
        if isinstance(image, str):
            return cv2.imread(image)
        if isinstance(image, np.ndarray):
            return image
        return None

    def _pick_position(self, placement: Dict[str, Dict[str, Any]], preferred: Optional[str]) -> str:
        if preferred and placement.get(preferred):
            return preferred
        # Otherwise, pick the highest score among available options
        best_pos = None
        best_score = -1.0
        for pos, data in placement.items():
            if not data:
                continue
            s = float(data.get("score", 0.0))
            if s > best_score:
                best_score = s
                best_pos = pos
        if not best_pos:
            raise ValueError("No suitable placement options found.")
        return best_pos

    def _auto_behind(self, saliency: Optional[np.ndarray], box: Optional[Tuple[int, int, int, int]]) -> bool:
        if saliency is None or box is None:
            return False
        x0, y0, x1, y1 = box
        H, W = saliency.shape[:2]
        x0 = max(0, min(W, int(x0)))
        x1 = max(0, min(W, int(x1)))
        y0 = max(0, min(H, int(y0)))
        y1 = max(0, min(H, int(y1)))
        if x1 <= x0 or y1 <= y0:
            return False
        region = saliency[y0:y1, x0:x1]
        if region.size == 0:
            return False
        subject_fraction = float((region > 0.5).mean())
        return subject_fraction >= 0.15

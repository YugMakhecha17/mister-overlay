# TextOverlay (programmatic API)

High-level API for intelligent text placement and rendering on images. Wraps the existing interactive pipeline to provide a clean, non-CLI interface.

## Features
- Intelligent placement regions: `left`, `center`, `right`, `center_left`, `center_middle`, `center_right`, `bottom_left`, `bottom_center`, `bottom_right`, plus `custom` (click-to-place in CLI)
- Saliency-, edge-, and variance-aware scoring for low-clutter regions
- Curated color choices, auto-contrast stroke, overlay/normal blend, subtle shadow
- Modern sans-serif defaults and font discovery on Windows

## Install (local workspace)
This package is designed to be used inside this repository. Optional saliency extras require PyTorch.

```
pip install -e .
# optional extras for saliency
# pip install -e .[saliency]
```

Make sure model weights `u2net.pth` are present in the project root (or pass a custom path).

## Quick start
```python
from textoverlay import TextOverlayAPI

api = TextOverlayAPI(weights="u2net.pth")

# One-call flow (non-interactive):
api.run(
    image="data/Ad1.png",
    text="Summer Sale",
    preferred_area="bottom_right",   # or None for best-scoring area
    font_family=None,                 # auto-picks a clean sans if None
    font_size=None,                   # uses recommended (capped by image size)
    text_color_name=None,             # None -> auto from curated palette
    opacity=0.9,
    blend="overlay",
    shadow=True,
    output_path="final_overlay.png",
    behind_subject="auto",           # auto occlusion when subject present
)

# Manual steps:
analysis = api.analyze_image("data/Ad1.png", "Summer Sale")
position = "bottom_right"  # or any key in analysis['placement_options']
styles = api.suggest_styles(analysis, position, top_k=3)
img = api.render_overlay(
    analysis, position, text="Summer Sale", style=styles[0], output_path="final_overlay.png"
)
```

## Notes
- Color selection preference: by name only (e.g., `"white"`, `"navy"`, `"spotify green"`). The API accepts names and maps them to curated RGB.
- If `preferred_area` is missing or not available, `run()` picks the highest-scoring region.
- `blend="overlay"` works best on mid-tone backgrounds; automatically falls back to `normal` when needed.

## Modules referenced
- `interactive_overlay.py`: core rendering and style builder reused by the API
- `advanced_layout.py`: region analysis and scoring
- `vision.py`: saliency, edge, variance, integral images
- `font_manager.py`: font discovery, curated colors, style config
- `render.py`: low-level text measurement helpers

## Roadmap
- Palette extraction and color naming improvements
- Text suggestion engine and scene tags
- Public CLI parity for API flows
- Tests and demo assets
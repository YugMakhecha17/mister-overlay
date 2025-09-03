#!/usr/bin/env python3
"""
Test script to verify horizontal text layout functionality
"""
import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFont
from render import choose_optimal_layout, get_text_size

def test_layout_choice():
    """Test the layout choice logic with different box dimensions"""
    
    # Create a dummy image for testing
    img = Image.new('RGB', (800, 600), color='white')
    draw = ImageDraw.Draw(img)
    
    test_text = "Choose Super Choose Better"
    font_size = 48
    font_path = None  # Use default font
    
    # Test cases: (box, expected_layout)
    test_cases = [
        # Wide horizontal box - should prefer horizontal
        ((50, 250, 750, 350), 'horizontal'),
        # Narrow vertical box - should use vertical
        ((50, 50, 200, 400), 'vertical'),
        # Square box - depends on text fit
        ((50, 50, 300, 300), None),  # Could be either
    ]
    
    print("Testing layout choice logic:")
    print("-" * 50)
    
    for i, (box, expected) in enumerate(test_cases):
        x0, y0, x1, y1 = box
        box_width = x1 - x0
        box_height = y1 - y0
        aspect_ratio = box_width / box_height
        
        layout_type, lines = choose_optimal_layout(draw, test_text, box, font_path, font_size)
        
        print(f"Test {i+1}:")
        print(f"  Box: {box_width}x{box_height} (aspect ratio: {aspect_ratio:.2f})")
        print(f"  Layout chosen: {layout_type}")
        print(f"  Lines: {lines}")
        print(f"  Expected: {expected if expected else 'either'}")
        
        if expected and layout_type != expected:
            print(f"  ⚠️  WARNING: Expected {expected}, got {layout_type}")
        else:
            print(f"  ✅ OK")
        print()

def test_with_actual_image():
    """Test with an actual image to see the results"""
    try:
        # Load the wolf image
        img_path = "data/188-1888342_brad-pitt-png-brad-pitt.png"
        img_bgr = cv2.imread(img_path)
        if img_bgr is None:
            print(f"Could not load image: {img_path}")
            return
            
        img_pil = Image.fromarray(img_bgr[:,:,::-1])  # BGR to RGB
        draw = ImageDraw.Draw(img_pil)
        
        # Test different regions
        h, w = img_bgr.shape[:2]
        
        # Center region (wide)
        center_box = (w//3, h//3, 2*w//3, 2*h//3)
        
        # Left region (narrow)
        left_box = (0, 0, w//3, h)
        
        test_text = "Choose Super Choose Better"
        font_size = 48
        
        print("Testing with actual image regions:")
        print("-" * 50)
        
        regions = [
            ("Center (wide)", center_box),
            ("Left (narrow)", left_box)
        ]
        
        for name, box in regions:
            layout_type, lines = choose_optimal_layout(draw, test_text, box, None, font_size)
            x0, y0, x1, y1 = box
            aspect_ratio = (x1-x0) / (y1-y0)
            
            print(f"{name}:")
            print(f"  Box dimensions: {x1-x0}x{y1-y0} (aspect ratio: {aspect_ratio:.2f})")
            print(f"  Layout: {layout_type}")
            print(f"  Lines: {lines}")
            print()
            
    except Exception as e:
        print(f"Error testing with actual image: {e}")

if __name__ == "__main__":
    test_layout_choice()
    test_with_actual_image()
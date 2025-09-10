# TextOverlay 🖌️

[![Python](https://img.shields.io/badge/python-3.8+-blue)](https://www.python.org/)  
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)  

**TextOverlay** is a powerful Python library that intelligently overlays text on images in a systematic and visually appealing manner. It leverages computer vision and deep learning to automatically determine optimal text placement areas.

---

## ✨ Features

- **Intelligent Text Placement:** Uses CV/DL to analyze images and determine the best areas for text overlay.  
- **Custom Placement:** Allows precise text positioning anywhere on the image.  
- **Saliency Detection:** Ensures text is placed in visually optimal areas.  
- **Multiple Overlay Styles:** Supports various styling options for text overlays.  
- **Self-Contained:** Fully functional without relying on external APIs.  

---

## 🎯 Ideal Use Cases

- Social media posts  
- Digital marketing campaigns & ads  
- Product images  
- News articles  
- Blog posts  
- Any image requiring high-quality text overlay  

---

## 🚀 Getting Started

### Requirements

- Python 3.8+  
- [Pillow](https://pillow.readthedocs.io/) for image processing  
- [PyTorch](https://pytorch.org/) for AI models  

---

### Downloading Weights

TextOverlay uses the **U2Net** architecture. To download pre-trained weights, run:
You will be given two options:

u2net – Full weights, recommended for most cases.

u2netp – Lightweight version, faster but slightly less accurate.

Select the desired option to download the weights.

# Installation

Clone the repository and install dependencies:

# Clone the repository
`git clone https://github.com/YugMakhecha17/textoverlay.git`
`cd textoverlay`

# Install required packages
`pip install -r requirements.txt`

# Usage Example
```from textoverlay.overlay import interactive_overlay```

# Overlay text on an image
`interactive_overlay(
    image="data/sample_image.jpg",
    text="HELLO WORLD",
    preferred_area="custom"
)`

# Contributing

Contributions are welcome! For suggestions, bug reports, or collaboration:

GitHub: https://github.com/YugMakhecha17

Email: yugmakhecha1710@gmail.com

# License

MIT License © 2025 Yug Makhecha

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES, OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

```bash
python -m textoverlay.models.model_downloader list

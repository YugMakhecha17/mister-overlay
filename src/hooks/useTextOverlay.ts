import { useState, useCallback } from 'react';

interface PlacementOption {
  position: string;
  score: number;
  quality: 'excellent' | 'good' | 'fair';
  recommended_font_size: number;
}

interface StyleConfig {
  font_family: string;
  font_size: number;
  text_color: string;
  opacity: number;
  blend_mode: 'overlay' | 'normal';
  shadow: boolean;
}

export function useTextOverlay() {
  const [image, setImage] = useState<string | null>(null);
  const [text, setText] = useState('');
  const [selectedPosition, setSelectedPosition] = useState<string | null>(null);
  const [styleConfig, setStyleConfig] = useState<StyleConfig>({
    font_family: 'OpenSans-Regular',
    font_size: 32,
    text_color: 'white',
    opacity: 0.9,
    blend_mode: 'overlay',
    shadow: true
  });
  const [placementOptions, setPlacementOptions] = useState<Record<string, PlacementOption>>({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isRendering, setIsRendering] = useState(false);
  const [finalImage, setFinalImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = useCallback(async (file: File) => {
    try {
      setError(null);
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
      setFinalImage(null);
      setSelectedPosition(null);
      
      if (text.trim()) {
        await analyzeImage(file, text);
      }
    } catch (err) {
      setError('Failed to upload image');
      console.error(err);
    }
  }, [text]);

  const analyzeImage = useCallback(async (file: File, textToAnalyze: string) => {
    if (!file || !textToAnalyze.trim()) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      // Simulate API call to TextOverlay backend
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock placement options - in real implementation, this would come from your Python API
      const mockOptions: Record<string, PlacementOption> = {
        'bottom_right': {
          position: 'bottom_right',
          score: 0.85,
          quality: 'excellent',
          recommended_font_size: 32
        },
        'center_left': {
          position: 'center_left',
          score: 0.72,
          quality: 'good',
          recommended_font_size: 28
        },
        'top_center': {
          position: 'top_center',
          score: 0.68,
          quality: 'good',
          recommended_font_size: 24
        },
        'bottom_left': {
          position: 'bottom_left',
          score: 0.61,
          quality: 'fair',
          recommended_font_size: 30
        }
      };

      setPlacementOptions(mockOptions);
      
      // Auto-select the best option
      const bestOption = Object.entries(mockOptions)
        .sort(([, a], [, b]) => b.score - a.score)[0];
      
      if (bestOption) {
        setSelectedPosition(bestOption[0]);
        setStyleConfig(prev => ({
          ...prev,
          font_size: bestOption[1].recommended_font_size
        }));
      }
    } catch (err) {
      setError('Failed to analyze image');
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  const handleRender = useCallback(async () => {
    if (!image || !text.trim() || !selectedPosition) return;

    setIsRendering(true);
    setError(null);

    try {
      // Simulate API call to render final image
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In real implementation, this would be the rendered image from your Python API
      // For now, we'll just use the original image as a placeholder
      setFinalImage(image);
    } catch (err) {
      setError('Failed to render overlay');
      console.error(err);
    } finally {
      setIsRendering(false);
    }
  }, [image, text, selectedPosition, styleConfig]);

  // Re-analyze when text changes
  const handleTextChange = useCallback(async (newText: string) => {
    setText(newText);
    setFinalImage(null);
    setSelectedPosition(null);
    
    if (image && newText.trim()) {
      // Convert image URL back to file for analysis
      // In real implementation, you'd store the original file
      const response = await fetch(image);
      const blob = await response.blob();
      const file = new File([blob], 'image.jpg', { type: blob.type });
      await analyzeImage(file, newText);
    } else {
      setPlacementOptions({});
    }
  }, [image, analyzeImage]);

  return {
    image,
    text,
    setText: handleTextChange,
    selectedPosition,
    setSelectedPosition,
    styleConfig,
    setStyleConfig,
    placementOptions,
    isAnalyzing,
    isRendering,
    finalImage,
    handleImageUpload,
    handleRender,
    error
  };
}
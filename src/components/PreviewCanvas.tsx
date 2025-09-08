import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Eye, Sparkles, Image as ImageIcon } from 'lucide-react';

interface PlacementOption {
  position: string;
  score: number;
  quality: 'excellent' | 'good' | 'fair';
  recommended_font_size: number;
}

interface PreviewCanvasProps {
  originalImage: string | null;
  finalImage: string | null;
  placementOptions: Record<string, PlacementOption>;
  selectedPosition: string | null;
  text: string;
  isAnalyzing: boolean;
}

export function PreviewCanvas({
  originalImage,
  finalImage,
  placementOptions,
  selectedPosition,
  text,
  isAnalyzing
}: PreviewCanvasProps) {
  const handleDownload = () => {
    if (finalImage) {
      const link = document.createElement('a');
      link.href = finalImage;
      link.download = 'text-overlay.png';
      link.click();
    }
  };

  const EmptyState = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center h-full text-center p-8"
    >
      <div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-blue-600/20 rounded-2xl flex items-center justify-center mb-6">
        <ImageIcon className="w-12 h-12 text-primary" />
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-2">
        Ready to Create Magic?
      </h3>
      <p className="text-muted-foreground max-w-md">
        Upload an image and add some text to get started. Our AI will analyze your image and suggest the best placement options.
      </p>
      <div className="flex items-center gap-2 mt-4 text-sm text-primary">
        <Sparkles className="w-4 h-4" />
        Powered by intelligent saliency detection
      </div>
    </motion.div>
  );

  const AnalyzingState = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center h-full text-center p-8"
    >
      <div className="relative mb-6">
        <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        <Sparkles className="w-6 h-6 text-primary absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-2">
        Analyzing Your Image
      </h3>
      <p className="text-muted-foreground">
        Our AI is finding the perfect spots for your text...
      </p>
    </motion.div>
  );

  if (!originalImage) {
    return (
      <div className="flex-1 bg-white/50 backdrop-blur-sm border-l border-border/50">
        <EmptyState />
      </div>
    );
  }

  return (
    <div className="flex-1 bg-white/50 backdrop-blur-sm border-l border-border/50 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-border/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Eye className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold">Preview</h2>
            {isAnalyzing && (
              <div className="flex items-center gap-2 text-sm text-primary">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                Analyzing...
              </div>
            )}
          </div>
          
          {finalImage && (
            <motion.button
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Download className="w-4 h-4" />
              Download
            </motion.button>
          )}
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 p-6 overflow-auto">
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            {isAnalyzing ? (
              <AnalyzingState />
            ) : (
              <motion.div
                key={finalImage || originalImage}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="relative"
              >
                <img
                  src={finalImage || originalImage}
                  alt="Preview"
                  className="w-full h-auto rounded-lg shadow-lg border border-border/20"
                />
                
                {/* Overlay info */}
                {finalImage && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute bottom-4 left-4 right-4 bg-black/80 backdrop-blur-sm text-white p-4 rounded-lg"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">"{text}"</div>
                        <div className="text-sm opacity-75">
                          Position: {selectedPosition?.replace('_', ' ')} • 
                          Quality: {placementOptions[selectedPosition || '']?.quality}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm opacity-75">Score</div>
                        <div className="font-bold">
                          {Math.round((placementOptions[selectedPosition || '']?.score || 0) * 100)}%
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ImageUpload } from './components/ImageUpload';
import { TextEditor } from './components/TextEditor';
import { PlacementSelector } from './components/PlacementSelector';
import { StyleCustomizer } from './components/StyleCustomizer';
import { PreviewCanvas } from './components/PreviewCanvas';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { LoadingOverlay } from './components/LoadingOverlay';
import { useTextOverlay } from './hooks/useTextOverlay';
import { Sparkles, Wand2 } from 'lucide-react';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const {
    image,
    text,
    setText,
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
  } = useTextOverlay();

  const hasImage = !!image;
  const hasText = text.trim().length > 0;
  const hasPlacement = !!selectedPosition;
  const canRender = hasImage && hasText && hasPlacement && !isAnalyzing;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex h-[calc(100vh-4rem)]">
        <AnimatePresence>
          {sidebarOpen && (
            <Sidebar onClose={() => setSidebarOpen(false)}>
              <div className="space-y-6">
                {/* Step 1: Upload Image */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="space-y-3"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                      1
                    </div>
                    <h3 className="font-semibold text-foreground">Upload Image</h3>
                  </div>
                  <ImageUpload onImageUpload={handleImageUpload} />
                </motion.div>

                {/* Step 2: Add Text */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: hasImage ? 1 : 0.5, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-3"
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium ${
                      hasImage ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                    }`}>
                      2
                    </div>
                    <h3 className={`font-semibold ${hasImage ? 'text-foreground' : 'text-muted-foreground'}`}>
                      Add Text
                    </h3>
                  </div>
                  <TextEditor 
                    text={text} 
                    onTextChange={setText} 
                    disabled={!hasImage}
                  />
                </motion.div>

                {/* Step 3: Choose Placement */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: hasText ? 1 : 0.5, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-3"
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium ${
                      hasText ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                    }`}>
                      3
                    </div>
                    <h3 className={`font-semibold ${hasText ? 'text-foreground' : 'text-muted-foreground'}`}>
                      Choose Placement
                    </h3>
                    {isAnalyzing && (
                      <div className="flex items-center gap-1 text-xs text-primary">
                        <Sparkles className="w-3 h-3 animate-pulse" />
                        Analyzing...
                      </div>
                    )}
                  </div>
                  <PlacementSelector
                    options={placementOptions}
                    selected={selectedPosition}
                    onSelect={setSelectedPosition}
                    disabled={!hasText || isAnalyzing}
                  />
                </motion.div>

                {/* Step 4: Customize Style */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: hasPlacement ? 1 : 0.5, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="space-y-3"
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium ${
                      hasPlacement ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                    }`}>
                      4
                    </div>
                    <h3 className={`font-semibold ${hasPlacement ? 'text-foreground' : 'text-muted-foreground'}`}>
                      Customize Style
                    </h3>
                  </div>
                  <StyleCustomizer
                    config={styleConfig}
                    onChange={setStyleConfig}
                    disabled={!hasPlacement}
                  />
                </motion.div>

                {/* Render Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="pt-4 border-t border-border"
                >
                  <button
                    onClick={handleRender}
                    disabled={!canRender || isRendering}
                    className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                      canRender && !isRendering
                        ? 'bg-gradient-to-r from-primary to-blue-600 text-white hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]'
                        : 'bg-muted text-muted-foreground cursor-not-allowed'
                    }`}
                  >
                    {isRendering ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Rendering...
                      </>
                    ) : (
                      <>
                        <Wand2 className="w-4 h-4" />
                        Create Overlay
                      </>
                    )}
                  </button>
                </motion.div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive"
                  >
                    {error}
                  </motion.div>
                )}
              </div>
            </Sidebar>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-0' : 'ml-0'}`}>
          <PreviewCanvas
            originalImage={image}
            finalImage={finalImage}
            placementOptions={placementOptions}
            selectedPosition={selectedPosition}
            text={text}
            isAnalyzing={isAnalyzing}
          />
        </main>
      </div>

      <LoadingOverlay isVisible={isAnalyzing || isRendering} />
    </div>
  );
}

export default App;
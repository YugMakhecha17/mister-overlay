import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Star, Zap } from 'lucide-react';

interface PlacementOption {
  position: string;
  score: number;
  quality: 'excellent' | 'good' | 'fair';
  recommended_font_size: number;
}

interface PlacementSelectorProps {
  options: Record<string, PlacementOption>;
  selected: string | null;
  onSelect: (position: string) => void;
  disabled?: boolean;
}

export function PlacementSelector({ options, selected, onSelect, disabled }: PlacementSelectorProps) {
  const sortedOptions = Object.entries(options)
    .sort(([, a], [, b]) => b.score - a.score)
    .slice(0, 6); // Show top 6 options

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'excellent': return 'text-green-600 bg-green-50 border-green-200';
      case 'good': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'fair': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getQualityIcon = (quality: string) => {
    switch (quality) {
      case 'excellent': return <Star className="w-3 h-3" />;
      case 'good': return <Zap className="w-3 h-3" />;
      default: return <MapPin className="w-3 h-3" />;
    }
  };

  const formatPosition = (position: string) => {
    return position
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  if (Object.keys(options).length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <MapPin className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">Add text to see placement options</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-2"
    >
      <AnimatePresence>
        {sortedOptions.map(([position, option], index) => (
          <motion.button
            key={position}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => !disabled && onSelect(position)}
            disabled={disabled}
            className={`w-full p-3 rounded-lg border transition-all duration-200 text-left ${
              selected === position
                ? 'border-primary bg-primary/5 shadow-sm'
                : 'border-border hover:border-primary/50 hover:bg-accent/50'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getQualityColor(option.quality)}`}>
                  <div className="flex items-center gap-1">
                    {getQualityIcon(option.quality)}
                    {option.quality}
                  </div>
                </div>
                <div>
                  <div className="font-medium text-sm">{formatPosition(position)}</div>
                  <div className="text-xs text-muted-foreground">
                    Score: {(option.score * 100).toFixed(0)}% • Size: {option.recommended_font_size}px
                  </div>
                </div>
              </div>
              
              {index === 0 && (
                <div className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full font-medium">
                  Best
                </div>
              )}
            </div>
          </motion.button>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}
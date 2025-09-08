import React from 'react';
import { motion } from 'framer-motion';
import { Type, Sparkles } from 'lucide-react';

interface TextEditorProps {
  text: string;
  onTextChange: (text: string) => void;
  disabled?: boolean;
}

export function TextEditor({ text, onTextChange, disabled }: TextEditorProps) {
  const suggestions = [
    "Summer Sale 50% Off",
    "New Collection",
    "Limited Edition",
    "Coming Soon",
    "Best Seller",
    "Free Shipping"
  ];

  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="space-y-3"
    >
      <div className="relative">
        <textarea
          value={text}
          onChange={(e) => onTextChange(e.target.value)}
          disabled={disabled}
          placeholder="Enter your text here..."
          className="w-full h-24 p-3 border border-border rounded-lg resize-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-background"
        />
        <div className="absolute top-3 right-3">
          <Type className="w-4 h-4 text-muted-foreground" />
        </div>
      </div>

      {!disabled && text.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Sparkles className="w-3 h-3" />
            Quick suggestions:
          </div>
          <div className="flex flex-wrap gap-1">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => onTextChange(suggestion)}
                className="px-2 py-1 text-xs bg-accent hover:bg-accent/80 rounded-md transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {text.length > 0 && (
        <div className="text-xs text-muted-foreground">
          {text.length} characters
        </div>
      )}
    </motion.div>
  );
}
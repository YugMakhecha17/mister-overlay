import React from 'react';
import { motion } from 'framer-motion';
import { Palette, Type, Layers, Sun } from 'lucide-react';

interface StyleConfig {
  font_family: string;
  font_size: number;
  text_color: string;
  opacity: number;
  blend_mode: 'overlay' | 'normal';
  shadow: boolean;
}

interface StyleCustomizerProps {
  config: StyleConfig;
  onChange: (config: StyleConfig) => void;
  disabled?: boolean;
}

export function StyleCustomizer({ config, onChange, disabled }: StyleCustomizerProps) {
  const fontFamilies = [
    'OpenSans-Regular',
    'JosefinSans-Regular',
    'Roboto-Bold',
    'Quicksand-Bold',
    'AlexBrush-Regular',
    'AmaticSC-Regular'
  ];

  const colors = [
    { name: 'White', value: 'white' },
    { name: 'Black', value: 'black' },
    { name: 'Navy', value: 'navy' },
    { name: 'Gold', value: 'gold' },
    { name: 'Spotify Green', value: 'spotify green' },
    { name: 'Instagram Pink', value: 'instagram pink' },
    { name: 'Netflix Red', value: 'netflix red' },
    { name: 'Apple Gray', value: 'apple gray' }
  ];

  const updateConfig = (updates: Partial<StyleConfig>) => {
    onChange({ ...config, ...updates });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      {/* Font Family */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium">
          <Type className="w-4 h-4" />
          Font Family
        </label>
        <select
          value={config.font_family}
          onChange={(e) => updateConfig({ font_family: e.target.value })}
          disabled={disabled}
          className="w-full p-2 border border-border rounded-lg bg-background disabled:opacity-50"
        >
          {fontFamilies.map((font) => (
            <option key={font} value={font}>
              {font.replace('-', ' ')}
            </option>
          ))}
        </select>
      </div>

      {/* Font Size */}
      <div className="space-y-2">
        <label className="flex items-center justify-between text-sm font-medium">
          <span className="flex items-center gap-2">
            <Type className="w-4 h-4" />
            Font Size
          </span>
          <span className="text-xs text-muted-foreground">{config.font_size}px</span>
        </label>
        <input
          type="range"
          min="12"
          max="72"
          value={config.font_size}
          onChange={(e) => updateConfig({ font_size: parseInt(e.target.value) })}
          disabled={disabled}
          className="w-full"
        />
      </div>

      {/* Text Color */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium">
          <Palette className="w-4 h-4" />
          Text Color
        </label>
        <div className="grid grid-cols-2 gap-2">
          {colors.map((color) => (
            <button
              key={color.value}
              onClick={() => updateConfig({ text_color: color.value })}
              disabled={disabled}
              className={`p-2 text-xs rounded-lg border transition-colors ${
                config.text_color === color.value
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border hover:border-primary/50'
              } disabled:opacity-50`}
            >
              {color.name}
            </button>
          ))}
        </div>
      </div>

      {/* Opacity */}
      <div className="space-y-2">
        <label className="flex items-center justify-between text-sm font-medium">
          <span className="flex items-center gap-2">
            <Layers className="w-4 h-4" />
            Opacity
          </span>
          <span className="text-xs text-muted-foreground">{Math.round(config.opacity * 100)}%</span>
        </label>
        <input
          type="range"
          min="0.1"
          max="1"
          step="0.1"
          value={config.opacity}
          onChange={(e) => updateConfig({ opacity: parseFloat(e.target.value) })}
          disabled={disabled}
          className="w-full"
        />
      </div>

      {/* Blend Mode */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium">
          <Layers className="w-4 h-4" />
          Blend Mode
        </label>
        <div className="grid grid-cols-2 gap-2">
          {['overlay', 'normal'].map((mode) => (
            <button
              key={mode}
              onClick={() => updateConfig({ blend_mode: mode as 'overlay' | 'normal' })}
              disabled={disabled}
              className={`p-2 text-xs rounded-lg border transition-colors capitalize ${
                config.blend_mode === mode
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border hover:border-primary/50'
              } disabled:opacity-50`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Shadow */}
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm font-medium">
          <Sun className="w-4 h-4" />
          Drop Shadow
        </label>
        <button
          onClick={() => updateConfig({ shadow: !config.shadow })}
          disabled={disabled}
          className={`w-12 h-6 rounded-full transition-colors relative ${
            config.shadow ? 'bg-primary' : 'bg-muted'
          } disabled:opacity-50`}
        >
          <div
            className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform absolute top-0.5 ${
              config.shadow ? 'translate-x-6' : 'translate-x-0.5'
            }`}
          />
        </button>
      </div>
    </motion.div>
  );
}
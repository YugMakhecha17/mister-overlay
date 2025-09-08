import React from 'react';
import { motion } from 'framer-motion';
import { Menu, Sparkles, Github, Heart } from 'lucide-react';

interface HeaderProps {
  onToggleSidebar: () => void;
}

export function Header({ onToggleSidebar }: HeaderProps) {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="h-16 bg-white/80 backdrop-blur-md border-b border-border/50 flex items-center justify-between px-6 sticky top-0 z-50"
    >
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="p-2 hover:bg-accent rounded-lg transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-blue-600 rounded-lg flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gradient">TextOverlay Studio</h1>
            <p className="text-xs text-muted-foreground">Intelligent text placement powered by AI</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 hover:bg-accent rounded-lg transition-colors text-muted-foreground hover:text-foreground"
        >
          <Github className="w-5 h-5" />
        </a>
        
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          Made with <Heart className="w-3 h-3 text-red-500" /> by TextOverlay
        </div>
      </div>
    </motion.header>
  );
}
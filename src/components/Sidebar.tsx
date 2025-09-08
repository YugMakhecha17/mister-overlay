import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

interface SidebarProps {
  children: React.ReactNode;
  onClose: () => void;
}

export function Sidebar({ children, onClose }: SidebarProps) {
  return (
    <motion.aside
      initial={{ x: -320, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -320, opacity: 0 }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="w-80 bg-white/90 backdrop-blur-md border-r border-border/50 p-6 overflow-y-auto"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-foreground">Create Overlay</h2>
        <button
          onClick={onClose}
          className="p-1 hover:bg-accent rounded-md transition-colors lg:hidden"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      
      {children}
    </motion.aside>
  );
}
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface NumberDrawProps {
  drawnNumbers: number[];
  isDrawing: boolean;
}

export function NumberDraw({ drawnNumbers, isDrawing }: NumberDrawProps) {
  return (
    <div className="flex justify-center space-x-4">
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="relative w-16 h-16">
          {drawnNumbers[index] !== undefined && (
            <motion.div
              key={`${drawnNumbers[index]}-${index}`}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ 
                duration: 0.8,
                delay: index * 0.8,
                type: "spring",
                stiffness: 200
              }}
              className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center"
            >
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.8 + 0.4 }}
                className="text-2xl font-bold text-white"
              >
                {drawnNumbers[index]}
              </motion.span>
            </motion.div>
          )}
        </div>
      ))}
    </div>
  );
}
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';

interface WinnerAnimationProps {
  show: boolean;
  prize: number;
  onClose: () => void;
}

export function WinnerAnimation({ show, prize, onClose }: WinnerAnimationProps) {
  useEffect(() => {
    if (show) {
      // Trigger confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      // Auto-close after 1 second
      const timer = setTimeout(() => {
        onClose();
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="bg-white rounded-lg p-8 text-center"
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-3xl font-bold text-green-500 mb-4">🎉 Congratulations! 🎉</h2>
        <p className="text-xl">You won</p>
        <p className="text-4xl font-bold text-blue-600 my-4">{prize} Birr</p>
      </motion.div>
    </motion.div>
  );
}
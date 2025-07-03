import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GradientText from '../UI/GradientText';

const RotatingText: React.FC = () => {
  const roles = [
    "League of Legends Modding Enthusiast",
    "Skin Explorer Developer", 
    "Bin Reader Creator",
    "AI-Assisted Tool Builder",
    "Champion Mod Specialist"
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % roles.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [roles.length]);

  return (
    <div className="h-16 flex items-center justify-center">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="text-xl md:text-2xl font-medium"
        >
          <GradientText animationSpeed={10}>
            {roles[currentIndex]}
          </GradientText>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default RotatingText;
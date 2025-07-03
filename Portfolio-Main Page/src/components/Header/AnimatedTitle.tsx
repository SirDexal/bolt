import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import GradientText from '../UI/GradientText';

const AnimatedTitle: React.FC = () => {
  const [isTyping, setIsTyping] = useState(true);
  const text = "SirDexal";

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTyping(false);
    }, 3500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative">
      <motion.h1
        className="text-6xl md:text-8xl font-bold relative"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <GradientText 
          className="text-6xl md:text-8xl font-bold"
          animationSpeed={6}
        >
          <span className={`${isTyping ? 'typing-text' : ''}`}>
            {text}
          </span>
        </GradientText>
        {isTyping && (
          <span className="absolute -right-1 top-0 w-1 h-full bg-primary-400 animate-pulse" />
        )}
      </motion.h1>
      
      <motion.div
        className="absolute -inset-4 bg-primary-500/10 rounded-lg blur-xl"
        animate={{ 
          scale: [1, 1.05, 1],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{ 
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </div>
  );
};

export default AnimatedTitle;
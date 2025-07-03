import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Sparkles } from 'lucide-react';
import AnimatedTitle from '../Header/AnimatedTitle';
import RotatingText from '../Header/RotatingText';
import GradientText from '../UI/GradientText';

const HeroSection: React.FC = () => {
  const scrollToTools = () => {
    const toolsSection = document.getElementById('tools');
    toolsSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="relative py-32 px-6 min-h-screen flex items-center">
      <div className="container mx-auto text-center max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="space-y-8"
        >
          <AnimatedTitle />
          <RotatingText />
          
          <div className="relative mt-12">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute -top-4 -right-4 text-primary-400"
            >
              <Sparkles size={24} />
            </motion.div>
            
            <h2 className="text-2xl md:text-4xl font-bold text-white mb-6 leading-tight">
              Welcome to the Future of{" "}
              <GradientText className="inline" animationSpeed={6}>
                League of Legends Modding
              </GradientText>
            </h2>
          </div>

          <p className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto">
            A passionate modder who codes tools for the League of Legends 
            community. Creating utilities to enhance your gaming experience, one 
            mod at a time.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
            <motion.button
              onClick={scrollToTools}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group relative px-8 py-4 bg-transparent border-2 border-primary-500 rounded-xl font-semibold overflow-hidden transition-all duration-300 min-h-[60px]"
            >
              <div className="relative z-10 flex items-center justify-center gap-2 h-full">
                <span className="text-white group-hover:text-transparent transition-colors duration-300 whitespace-nowrap">
                  Explore Tools
                </span>
                <motion.div
                  animate={{ y: [0, 5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-white group-hover:text-transparent transition-colors duration-300"
                >
                  <ChevronDown size={20} />
                </motion.div>
              </div>
              
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                <div className="flex items-center gap-2">
                  <GradientText className="whitespace-nowrap">
                    Explore Tools
                  </GradientText>
                  <ChevronDown size={20} className="text-primary-400" />
                </div>
              </div>
              
              <div className="absolute inset-0 bg-primary-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group relative px-8 py-4 bg-transparent border-2 border-primary-500 rounded-xl font-semibold overflow-hidden transition-all duration-300 min-h-[60px]"
            >
              <div className="relative z-10 flex items-center justify-center h-full">
                <span className="text-white group-hover:text-transparent transition-colors duration-300 whitespace-nowrap">
                  Learn More
                </span>
              </div>
              
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                <GradientText className="whitespace-nowrap">
                  Learn More
                </GradientText>
              </div>
              
              <div className="absolute inset-0 bg-primary-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
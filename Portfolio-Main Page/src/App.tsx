import React from 'react';
import { motion } from 'framer-motion';
import Header from './components/Header/Header';
import HeroSection from './components/Hero/HeroSection';
import ToolsGrid from './components/Tools/ToolsGrid';
import AboutSection from './components/About/AboutSection';
import Footer from './components/Footer/Footer';
import ParticleBackground from './components/Background/ParticleBackground';

function App() {
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <ParticleBackground />
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative z-10"
      >
        <Header />
        <main>
          <HeroSection />
          <ToolsGrid />
          <AboutSection />
        </main>
        <Footer />
      </motion.div>
    </div>
  );
}

export default App;
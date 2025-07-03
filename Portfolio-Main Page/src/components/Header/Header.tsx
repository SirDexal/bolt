import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Github, MessageCircle, Mail, Menu, X } from 'lucide-react';
import GradientText from '../UI/GradientText';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { name: 'Home', href: '#home' },
    { name: 'Tools', href: '#tools' },
    { name: 'About', href: '#about' },
    { name: 'Contact', href: '#contact' },
  ];

  const socialLinks = [
    { name: 'GitHub', icon: Github, href: '#' },
    { name: 'Discord', icon: MessageCircle, href: '#' },
    { name: 'Email', icon: Mail, href: 'mailto:contact@sirdexal.dev' },
  ];

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 glass-effect"
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="relative"
          >
            <GradientText className="text-2xl md:text-3xl font-bold cursor-pointer">
              SirDexal
            </GradientText>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <motion.a
                key={item.name}
                href={item.href}
                className="relative text-white font-medium transition-all duration-300 group"
              >
                <span className="group-hover:text-transparent transition-colors duration-300">
                  {item.name}
                </span>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <GradientText animationSpeed={4}>
                    {item.name}
                  </GradientText>
                </div>
              </motion.a>
            ))}
          </nav>

          {/* Social Links */}
          <div className="hidden md:flex items-center space-x-4">
            {socialLinks.map((social) => (
              <motion.a
                key={social.name}
                href={social.href}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 text-primary-200 hover:text-primary-100 transition-colors duration-300"
                aria-label={social.name}
              >
                <social.icon size={20} />
              </motion.a>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-primary-200 hover:text-primary-100"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <motion.div
          initial={false}
          animate={{ height: isMenuOpen ? 'auto' : 0, opacity: isMenuOpen ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="md:hidden overflow-hidden"
        >
          <div className="py-4 space-y-4">
            {navItems.map((item) => (
              <motion.a
                key={item.name}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className="block relative text-white font-medium transition-all duration-300 group"
              >
                <span className="group-hover:text-transparent transition-colors duration-300">
                  {item.name}
                </span>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <GradientText animationSpeed={4}>
                    {item.name}
                  </GradientText>
                </div>
              </motion.a>
            ))}
            
            <div className="flex items-center space-x-4 pt-4 border-t border-primary-900/30">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  whileHover={{ scale: 1.1 }}
                  className="p-2 text-primary-200 hover:text-primary-100 transition-colors duration-300"
                  aria-label={social.name}
                >
                  <social.icon size={20} />
                </motion.a>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.header>
  );
};

export default Header;
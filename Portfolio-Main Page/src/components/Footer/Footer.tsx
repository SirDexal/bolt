import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Github, MessageCircle, Mail } from 'lucide-react';
import GradientText from '../UI/GradientText';

const Footer: React.FC = () => {
  const contactMethods = [
    {
      name: 'GitHub',
      icon: Github,
      href: '#',
      description: 'Check out the source code and contribute to the tools'
    },
    {
      name: 'Discord',
      icon: MessageCircle,
      href: '#',
      description: 'Join the community for support, discussions, and tool updates'
    },
    {
      name: 'Email',
      icon: Mail,
      href: 'mailto:contact@sirdexal.dev',
      description: 'Reach out directly for questions or collaboration ideas'
    }
  ];

  return (
    <footer id="contact" className="relative mt-20">
      {/* Get In Touch Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              <GradientText className="text-4xl md:text-5xl font-bold">
                Get In Touch
              </GradientText>
            </h2>
            <p className="text-xl text-gray-300 leading-relaxed">
              Questions about the tools? Found a bug? Want to suggest a new feature? Or just want to 
              chat about League modding? I'd love to hear from you!
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {contactMethods.map((method, index) => (
              <motion.a
                key={method.name}
                href={method.href}
                whileHover={{ scale: 1.02, y: -5 }}
                whileTap={{ scale: 0.98 }}
                className="group p-6 glass-effect rounded-xl hover:border-primary-700/40 transition-all duration-300 block"
              >
                <div className="p-4 bg-gradient-to-br from-primary-600 to-primary-500 rounded-lg w-fit mx-auto mb-4">
                  <method.icon size={32} className="text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2 relative">
                  <span className="text-white group-hover:text-transparent transition-colors duration-300 block text-center">
                    {method.name}
                  </span>
                  <div className="absolute top-0 left-0 w-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                    <GradientText className="text-xl font-semibold block text-center">
                      {method.name}
                    </GradientText>
                  </div>
                </h3>
                <p className="text-gray-300 leading-relaxed text-sm">
                  {method.description}
                </p>
              </motion.a>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Footer Bar */}
      <div className="border-t border-primary-900/30 glass-effect">
        <div className="container mx-auto px-6 py-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-4"
          >
            <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
              <span>Made with</span>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <Heart size={16} className="text-red-400" fill="currentColor" />
              </motion.div>
              <span>for the LoL community</span>
            </div>
            
            <p className="text-sm text-gray-400">
              &copy; 2025 SirDexal. All rights reserved.
            </p>
            
            <p className="text-xs text-gray-500 italic max-w-2xl mx-auto">
              This project is not endorsed by Riot Games and doesn't reflect the views or opinions of Riot Games or anyone officially involved in producing or managing League of Legends.
            </p>
          </motion.div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
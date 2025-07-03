import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Code, Gamepad2, Zap, Users, Shield, Wrench, Heart } from 'lucide-react';
import GradientText from '../UI/GradientText';

const AboutSection: React.FC = () => {
  const highlights = [
    {
      icon: Code,
      title: "Community Focused",
      description: "Tools built by a modder, for modders. Understanding the real needs of the community."
    },
    {
      icon: Zap,
      title: "Practical Solutions", 
      description: "No-nonsense utilities that solve actual problems faced by League modders daily."
    },
    {
      icon: Shield,
      title: "Safe & Tested",
      description: "All tools are thoroughly tested within the community before release."
    },
    {
      icon: Users,
      title: "Open Source Spirit",
      description: "Sharing knowledge and tools freely to help the modding community grow."
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <section id="about" className="py-20 px-6">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            <GradientText className="text-4xl md:text-5xl font-bold">
              About SirDexal
            </GradientText>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Just a passionate League of Legends modder who happens to code. I create tools not 
            because I'm a professional developer, but because I love modding and want to make it 
            easier for everyone in the community. Every utility comes from real experience and actual 
            needs.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Highlights */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {highlights.map((highlight, index) => (
              <motion.div
                key={highlight.title}
                variants={itemVariants}
                className="group p-6 glass-effect rounded-xl hover:border-primary-700/40 transition-all duration-300"
              >
                <div className="p-3 bg-gradient-to-br from-primary-600 to-primary-500 rounded-lg w-fit mb-4">
                  <highlight.icon size={24} className="text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2 relative">
                  <span className="text-white group-hover:text-transparent transition-colors duration-300 block text-left">
                    {highlight.title}
                  </span>
                  <div className="absolute top-0 left-0 w-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                    <GradientText className="text-lg font-semibold block text-left">
                      {highlight.title}
                    </GradientText>
                  </div>
                </h3>
                <p className="text-gray-300 leading-relaxed text-sm text-left">
                  {highlight.description}
                </p>
              </motion.div>
            ))}
          </motion.div>

          {/* Right Column - Philosophy */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
          >
            <div className="relative p-8 glass-effect rounded-2xl">
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-primary-600/5 to-purple-600/5 rounded-2xl"
                animate={{ 
                  scale: [1, 1.02, 1],
                  opacity: [0.3, 0.6, 0.3]
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              
              <div className="relative z-10 space-y-6">
                <h3 className="text-2xl font-bold text-left">
                  <GradientText className="text-2xl font-bold block text-left">
                    Why These Tools Exist
                  </GradientText>
                </h3>
                
                <div className="space-y-4 text-gray-300 leading-relaxed text-left">
                  <p>
                    As someone who spends countless hours modding League of Legends, I've encountered the same 
                    frustrations we all face. Instead of just complaining, I decided to learn coding and build solutions. These 
                    aren't perfect enterprise applications - they're practical tools made by a modder who understands the 
                    struggle. If they help even one person save time or fix a broken skin, then the effort was worth it.
                  </p>
                </div>

                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute -top-4 -right-4 text-primary-400/30"
                >
                  <Heart size={32} />
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
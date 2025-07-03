import React from 'react';
import { motion } from 'framer-motion';
import ToolCard from './ToolCard';
import { Eye, FileText, Wrench, Zap, Settings } from 'lucide-react';
import GradientText from '../UI/GradientText';

const ToolsGrid: React.FC = () => {
  const tools = [
    {
      id: 'skin-explorer',
      title: 'Skin Explorer',
      description: 'Browse and preview custom champion skins with advanced filtering and search capabilities.',
      icon: Eye,
      status: 'Available',
      statusColor: 'text-green-400',
      features: ['Real-time skin preview', 'Advanced filtering system', 'Batch operations', 'Export functionality', 'Skin comparison tools'],
      gradient: 'from-primary-600 to-blue-600'
    },
    {
      id: 'skin-fixer',
      title: "SirDexal's Skin Fixer",
      description: 'Automatically detect and fix common issues with custom League of Legends skins.',
      icon: Settings,
      status: 'Available',
      statusColor: 'text-green-400',
      features: ['Automatic skin validation', 'Common issue detection', 'One-click fixes', 'Backup creation', 'Batch processing'],
      gradient: 'from-primary-600 to-green-600'
    },
    {
      id: 'bin-reader',
      title: 'Bin Reader',
      description: 'View and analyze contents of League .bin files with comprehensive data visualization.',
      icon: FileText,
      status: 'In Development',
      statusColor: 'text-yellow-400',
      features: ['File Analysis', 'Data Extraction', 'Structure View', 'Export Data'],
      gradient: 'from-primary-600 to-purple-600'
    },
    {
      id: 'mod-manager',
      title: 'Mod Manager',
      description: 'Comprehensive mod management system for organizing and deploying League modifications.',
      icon: Wrench,
      status: 'Coming Soon',
      statusColor: 'text-blue-400',
      features: ['Asset Tools', 'Batch Processing', 'Auto-Detection', 'Template System'],
      gradient: 'from-primary-600 to-indigo-600'
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

  return (
    <section id="tools" className="py-20 px-6">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            <GradientText className="text-4xl md:text-5xl font-bold">
              Community Tools
            </GradientText>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Practical utilities born from real modding experience. Each tool solves problems I've 
            personally encountered while modding League of Legends. Simple, effective, and built 
            with the community in mind.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto"
        >
          {tools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </motion.div>

        {/* More Tools Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-20 text-center"
        >
          <div className="glass-effect rounded-2xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">
              <GradientText className="text-2xl font-bold">
                More Tools in the Works
              </GradientText>
            </h3>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Got an idea for a tool that would help the modding community? I'm always looking for new problems to solve. 
              Join the Discord to suggest features, report bugs, or just chat about League modding with fellow enthusiasts.
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group relative px-8 py-3 bg-transparent border-2 border-primary-500 rounded-xl font-semibold overflow-hidden transition-all duration-300 min-h-[56px]"
            >
              <div className="relative z-10 flex items-center justify-center h-full">
                <span className="text-white group-hover:text-transparent transition-colors duration-300 whitespace-nowrap">
                  Join Discord Community
                </span>
              </div>
              
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                <GradientText className="whitespace-nowrap">
                  Join Discord Community
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

export default ToolsGrid;
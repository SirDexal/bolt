import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Check } from 'lucide-react';
import GradientText from '../UI/GradientText';

interface Tool {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  status: string;
  statusColor: string;
  features: string[];
  gradient: string;
}

interface ToolCardProps {
  tool: Tool;
}

const ToolCard: React.FC<ToolCardProps> = ({ tool }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { title, description, icon: Icon, status, statusColor, features, gradient } = tool;

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative"
    >
      <motion.div
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3 }}
        className="relative p-8 glass-effect rounded-2xl overflow-hidden h-full"
      >
        {/* Animated background gradient */}
        <motion.div
          className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
        />
        
        {/* Glow effect */}
        <motion.div
          className="absolute inset-0 bg-primary-500/5 rounded-2xl blur-xl"
          animate={{
            scale: isHovered ? 1.1 : 1,
            opacity: isHovered ? 1 : 0.3
          }}
          transition={{ duration: 0.3 }}
        />

        <div className="relative z-10 h-full flex flex-col">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className={`p-4 bg-gradient-to-br ${gradient} rounded-xl shadow-lg`}>
              <Icon size={32} className="text-white" />
            </div>
            
            <div className="text-right">
              <span className={`text-sm font-medium px-3 py-1 glass-effect rounded-full border border-current/20`}>
                <GradientText 
                  colors={status === 'Available' ? ['#10b981', '#34d399', '#6ee7b7'] : 
                         status === 'In Development' ? ['#f59e0b', '#fbbf24', '#fcd34d'] :
                         status === 'Coming Soon' ? ['#3b82f6', '#60a5fa', '#93c5fd'] :
                         ['#8b5cf6', '#c084fc', '#d8b4fe']}
                  animationSpeed={6}
                >
                  {status}
                </GradientText>
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-4 flex-grow">
            <h3 className="text-2xl font-bold relative">
              <span className="text-white group-hover:text-transparent transition-colors duration-300 block text-left">
                {title}
              </span>
              <div className="absolute top-0 left-0 w-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <GradientText className="text-2xl font-bold block text-left">
                  {title}
                </GradientText>
              </div>
            </h3>
            
            <p className="text-gray-300 leading-relaxed text-left">
              {description}
            </p>

            {/* Features */}
            <div className="space-y-2">
              <h4 className="text-sm font-semibold uppercase tracking-wide text-left">
                <GradientText animationSpeed={8} className="block text-left">
                  Features
                </GradientText>
              </h4>
              <div className="space-y-2">
                {features.map((feature, index) => (
                  <motion.div
                    key={feature}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-2 text-sm text-gray-300"
                  >
                    <Check size={14} className="text-primary-400 flex-shrink-0" />
                    <span>{feature}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Action Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="group/button mt-6 w-full relative px-6 py-4 bg-primary-600 rounded-xl font-medium transition-all duration-300 overflow-hidden min-h-[56px]"
            disabled={status === 'Coming Soon'}
          >
            <div className="relative z-10 flex items-center justify-center gap-2 h-full">
              <span className="text-white group-hover/button:text-transparent transition-colors duration-300 whitespace-nowrap">
                {status === 'Available' ? 'Launch Tool' : 
                 status === 'In Development' ? 'Preview' : 
                 'Notify Me'}
              </span>
              <ExternalLink size={16} className="text-white group-hover/button:text-transparent transition-colors duration-300 flex-shrink-0" />
            </div>
            
            <div className="absolute inset-0 opacity-0 group-hover/button:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
              <div className="flex items-center gap-2">
                <GradientText 
                  colors={['#ffffff', '#f8fafc', '#ffffff']}
                  animationSpeed={4}
                  className="whitespace-nowrap"
                >
                  {status === 'Available' ? 'Launch Tool' : 
                   status === 'In Development' ? 'Preview' : 
                   'Notify Me'}
                </GradientText>
                <ExternalLink size={16} className="text-white flex-shrink-0" />
              </div>
            </div>
            
            <div className="absolute inset-0 bg-primary-500/20 opacity-0 group-hover/button:opacity-100 transition-opacity duration-300" />
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ToolCard;
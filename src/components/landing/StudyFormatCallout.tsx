'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

interface CalloutItemProps {
  title: string;
  description: string;
  color: string;
  delay: number;
}

export const StudyFormatCallout = ({ 
  title, 
  items, 
  type 
}: { 
  title: string; 
  items: { title: string; description: string; color: string }[];
  type: 'flashcard' | 'quiz'
}) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
    rootMargin: '50px'
  });

  const containerClass = type === 'flashcard' 
    ? 'bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20' 
    : 'bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20';

  const headingClass = type === 'flashcard'
    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent'
    : 'bg-gradient-to-r from-amber-600 to-orange-600 dark:from-amber-400 dark:to-orange-400 bg-clip-text text-transparent';

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5 }}
      className={`rounded-xl shadow-lg p-8 ${containerClass} mt-10 mb-16 border border-gray-100 dark:border-gray-800`}
    >
      <h4 className="text-2xl font-bold mb-6 text-center">
        <span className={headingClass}>{title}</span>
      </h4>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {items.map((item, index) => (
          <CalloutItem 
            key={index}
            title={item.title}
            description={item.description}
            color={item.color}
            delay={index * 0.1}
          />
        ))}
      </div>
    </motion.div>
  );
};

const CalloutItem = ({ title, description, color, delay }: CalloutItemProps) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const getBgColor = () => {
    switch (color) {
      case 'blue': return 'bg-blue-500';
      case 'green': return 'bg-green-500';
      case 'purple': return 'bg-purple-500';
      case 'amber': return 'bg-amber-500';
      case 'orange': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const getTextColor = () => {
    switch (color) {
      case 'blue': return 'text-blue-600 dark:text-blue-400';
      case 'green': return 'text-green-600 dark:text-green-400';
      case 'purple': return 'text-purple-600 dark:text-purple-400';
      case 'amber': return 'text-amber-600 dark:text-amber-400';
      case 'orange': return 'text-orange-600 dark:text-orange-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 10 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
      transition={{ duration: 0.4, delay }}
      className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md relative overflow-hidden hover:shadow-lg transition-shadow duration-300"
    >
      <div className={`absolute top-0 left-0 w-1.5 h-full ${getBgColor()}`}></div>
      <h5 className={`text-lg font-semibold ${getTextColor()} mb-2`}>{title}</h5>
      <p className="text-base text-gray-600 dark:text-gray-300 leading-relaxed">{description}</p>
    </motion.div>
  );
};

'use client';

import { FileText, BookOpen, Zap, Brain } from 'lucide-react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

interface FeatureCardProps {
    icon: React.ElementType;
    title: string;
    description: string;
    color: string;
    delay: number;
}

const FeatureCard = ({ icon: Icon, title, description, color, delay }: FeatureCardProps) => {
    const [ref, inView] = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: delay * 0.1 }}
            className={`p-6 rounded-xl bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow border-t-2 border-${color}-500`}
        >
            <div className={`inline-flex p-3 rounded-lg bg-${color}-50 dark:bg-${color}-900/20 mb-4`}>
                <Icon className={`h-6 w-6 text-${color}-500 dark:text-${color}-400`} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
            <p className="text-gray-600 dark:text-gray-300">{description}</p>
        </motion.div>
    );
};

export function DetailedFeatures() {
    const [ref, inView] = useInView({
        triggerOnce: true,
        threshold: 0.1,
        rootMargin: '50px'
    });

    const features = [
        {
            icon: FileText,
            title: "Smart Notes",
            description: "AI-generated structured notes extracted from PDFs, videos, and other content formats.",
            color: "blue",
        },
        {
            icon: BookOpen,
            title: "Flashcards",
            description: "Automatically generated flashcards to help you memorize key concepts effectively.",
            color: "indigo",
        },
        {
            icon: Zap,
            title: "Quizzes",
            description: "Test your knowledge with AI-generated quizzes based on your uploaded content.",
            color: "purple",
        },
        {
            icon: Brain,
            title: "Mind Maps",
            description: "Visualize connections between concepts with interactive mind maps.",
            color: "green",
        }
    ];

    return (
        <section id="features" className="py-20 px-6">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    ref={ref}
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        Powerful <span className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">Learning Features</span>
                    </h2>
                    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                        Transform your study experience with our AI-powered learning tools
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, index) => (
                        <FeatureCard
                            key={feature.title}
                            icon={feature.icon}
                            title={feature.title}
                            description={feature.description}
                            color={feature.color}
                            delay={index}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

'use client';

import { useRouter } from 'next/navigation';
import { ArrowRight, PlayCircle } from 'lucide-react';

export function HeroSection() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push('/auth/signin');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
        Turn PDFs and Videos into
        <span className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
          {' '}Smart Study Notes
        </span>
      </h1>
      
      <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed max-w-3xl mx-auto">
        Upload content and get structured notes, flashcards, quizzes, and mind maps. 
        Transform your learning with AI-powered study tools.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
        <button 
          onClick={handleGetStarted}
          className="group bg-blue-600 dark:bg-blue-500 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-blue-700 dark:hover:bg-blue-600 transition-all duration-200 hover:scale-105 hover:shadow-lg flex items-center space-x-2 cursor-pointer"
        >
          <span>Get Started</span>
          <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
        </button>
        
        <button 
          onClick={() => {
            document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="group text-gray-700 dark:text-gray-300 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white dark:hover:bg-gray-800 hover:shadow-md transition-all duration-200 flex items-center space-x-2"
        >
          <PlayCircle className="h-5 w-5" />
          <span>Watch Demo</span>
        </button>
      </div>
    </div>
  );
}
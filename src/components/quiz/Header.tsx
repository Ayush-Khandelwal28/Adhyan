import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Brain } from 'lucide-react';

interface QuizHeaderProps {
  title: string;
  currentQuestion: number;
  totalQuestions: number;
  progress: number;
}

export const QuizHeader: React.FC<QuizHeaderProps> = ({
  title,
  currentQuestion,
  totalQuestions,
  progress
}) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Brain className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            {title}
          </h1>
        </div>
        <div className="text-sm md:text-base text-muted-foreground">
          Question {currentQuestion} of {totalQuestions}
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Progress</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>
    </div>
  );
};
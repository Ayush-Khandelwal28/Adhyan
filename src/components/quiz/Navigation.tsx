import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Flag } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuizNavigationProps {
  currentQuestion: number;
  totalQuestions: number;
  onPrevious: () => void;
  onNext: () => void;
  onFinish: () => void;
  canGoBack: boolean;
  canGoForward: boolean;
  isLastQuestion: boolean;
}

export const QuizNavigation: React.FC<QuizNavigationProps> = ({
  currentQuestion,
  totalQuestions,
  onPrevious,
  onNext,
  onFinish,
  canGoBack,
  canGoForward,
  isLastQuestion
}) => {
  return (
    <div className="flex flex-col items-center space-y-6">
      {/* Navigation Buttons */}
      <div className="flex items-center space-x-4">
        <Button
          onClick={onPrevious}
          disabled={!canGoBack}
          variant="outline"
          size="lg"
          className="flex items-center space-x-2"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous</span>
        </Button>

        {isLastQuestion ? (
          <Button
            onClick={onFinish}
            size="lg"
            className="flex items-center space-x-2 bg-green-600 hover:bg-green-700"
          >
            <Flag className="w-4 h-4" />
            <span>Finish Quiz</span>
          </Button>
        ) : (
          <Button
            onClick={onNext}
            disabled={!canGoForward}
            size="lg"
            className="flex items-center space-x-2"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
};
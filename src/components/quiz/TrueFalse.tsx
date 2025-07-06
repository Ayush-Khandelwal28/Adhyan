import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';
import { TrueFalseQuestion as TrueFalseQuestionType } from '@/lib/types';
import { cn } from '@/lib/utils';

interface TrueFalseQuestionProps {
  question: TrueFalseQuestionType;
  selectedAnswer?: boolean;
  onAnswerSelect: (answer: boolean) => void;
  questionNumber: number;
}

export const TrueFalseQuestion: React.FC<TrueFalseQuestionProps> = ({
  question,
  selectedAnswer,
  onAnswerSelect,
  questionNumber
}) => {
  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardContent className="p-8">
        <div className="space-y-8">
          {/* Question Number and Statement */}
          <div className="text-center">
            <div className="text-sm font-medium text-muted-foreground mb-4">
              Question {questionNumber} • True or False
            </div>
            <h2 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white leading-relaxed whitespace-pre-wrap break-words">
              {question.statement}
            </h2>
          </div>

          {/* Answer Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
            <Button
              onClick={() => onAnswerSelect(true)}
              variant={selectedAnswer === true ? "default" : "outline"}
              size="lg"
              className={cn(
                "h-16 text-lg font-semibold transition-all duration-200 cursor-pointer",
                selectedAnswer === true
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "hover:bg-green-50 hover:border-green-300 hover:text-green-700 dark:hover:bg-green-900/20"
              )}
            >
              <Check className="w-6 h-6 mr-3" />
              True
            </Button>
            
            <Button
              onClick={() => onAnswerSelect(false)}
              variant={selectedAnswer === false ? "default" : "outline"}
              size="lg"
              className={cn(
                "h-16 text-lg font-semibold transition-all duration-200  cursor-pointer",
                selectedAnswer === false
                  ? "bg-red-600 hover:bg-red-700 text-white"
                  : "hover:bg-red-50 hover:border-red-300 hover:text-red-700 dark:hover:bg-red-900/20"
              )}
            >
              <X className="w-6 h-6 mr-3" />
              False
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
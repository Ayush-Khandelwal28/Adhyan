import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MCQQuestion as MCQQuestionType } from '@/lib/types';
import { cn } from '@/lib/utils';

interface MCQQuestionProps {
  question: MCQQuestionType;
  selectedAnswer?: number;
  onAnswerSelect: (answerIndex: number) => void;
  questionNumber: number;
}

export const MCQQuestion: React.FC<MCQQuestionProps> = ({
  question,
  selectedAnswer,
  onAnswerSelect,
  questionNumber
}) => {
  const optionLabels = ['A', 'B', 'C', 'D', 'E', 'F'];

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardContent className="p-8">
        <div className="space-y-8">
          {/* Question Number and Text */}
          <div className="text-center">
            <div className="text-sm font-medium text-muted-foreground mb-4">
              Question {questionNumber} • Multiple Choice
            </div>
            <h2 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white leading-relaxed">
              {question.question}
            </h2>
          </div>

          {/* Answer Options */}
          <div className="space-y-3 max-w-3xl mx-auto">
            {question.options.map((option, index) => (
              <Button
                key={index}
                onClick={() => onAnswerSelect(index)}
                variant={selectedAnswer === index ? "default" : "outline"}
                size="lg"
                className={cn(
                  "w-full h-auto p-4 text-left justify-start transition-all duration-200",
                  selectedAnswer === index
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "hover:bg-blue-50 hover:border-blue-300 dark:hover:bg-blue-900/20"
                )}
              >
                <div className="flex items-start space-x-4 w-full">
                  <div className={cn(
                    "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold",
                    selectedAnswer === index
                      ? "bg-white text-blue-600"
                      : "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
                  )}>
                    {optionLabels[index]}
                  </div>
                  <span className="text-base leading-relaxed">
                    {option.text}
                  </span>
                </div>
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, ArrowLeft, Check, X } from 'lucide-react';
import { QuizQuestion, UserAnswer } from '@/lib/types';
import { cn } from '@/lib/utils';

interface QuizReviewProps {
  questions: QuizQuestion[];
  userAnswers: Map<number, UserAnswer>;
  onBackToResults: () => void;
}

export const QuizReview: React.FC<QuizReviewProps> = ({
  questions,
  userAnswers,
  onBackToResults
}) => {
  const optionLabels = ['A', 'B', 'C', 'D', 'E', 'F'];

  const renderTrueFalseReview = (question: QuizQuestion, questionIndex: number) => {
    if (question.type !== 'TRUE_FALSE') return null;
    
    const userAnswer = userAnswers.get(questionIndex);
    const correctAnswer = question.isTrue;
    const userSelectedAnswer = userAnswer?.answer as boolean;

    return (
      <div className="space-y-4">
        <div className="text-lg font-medium">
          {question.statement}
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className={cn(
            "p-4 rounded-lg border-2 flex items-center space-x-3",
            correctAnswer === true
              ? "border-green-500 bg-green-50 dark:bg-green-900/20"
              : userSelectedAnswer === true
              ? "border-red-500 bg-red-50 dark:bg-red-900/20"
              : "border-gray-200 dark:border-gray-700"
          )}>
            <Check className="w-5 h-5" />
            <span className="font-medium">True</span>
            {correctAnswer === true && <CheckCircle className="w-4 h-4 text-green-600 ml-auto" />}
            {userSelectedAnswer === true && correctAnswer !== true && <XCircle className="w-4 h-4 text-red-600 ml-auto" />}
          </div>
          
          <div className={cn(
            "p-4 rounded-lg border-2 flex items-center space-x-3",
            correctAnswer === false
              ? "border-green-500 bg-green-50 dark:bg-green-900/20"
              : userSelectedAnswer === false
              ? "border-red-500 bg-red-50 dark:bg-red-900/20"
              : "border-gray-200 dark:border-gray-700"
          )}>
            <X className="w-5 h-5" />
            <span className="font-medium">False</span>
            {correctAnswer === false && <CheckCircle className="w-4 h-4 text-green-600 ml-auto" />}
            {userSelectedAnswer === false && correctAnswer !== false && <XCircle className="w-4 h-4 text-red-600 ml-auto" />}
          </div>
        </div>
      </div>
    );
  };

  const renderMCQReview = (question: QuizQuestion, questionIndex: number) => {
    if (question.type !== 'MCQ') return null;
    
    const userAnswer = userAnswers.get(questionIndex);
    const userSelectedIndex = userAnswer?.answer as number;
    const correctIndex = question.options.findIndex(option => option.isCorrect);

    return (
      <div className="space-y-4">
        <div className="text-lg font-medium">
          {question.question}
        </div>
        
        <div className="space-y-3">
          {question.options.map((option, index) => (
            <div
              key={index}
              className={cn(
                "p-4 rounded-lg border-2 flex items-center space-x-3",
                index === correctIndex
                  ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                  : index === userSelectedIndex && index !== correctIndex
                  ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                  : "border-gray-200 dark:border-gray-700"
              )}
            >
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold",
                index === correctIndex
                  ? "bg-green-600 text-white"
                  : index === userSelectedIndex && index !== correctIndex
                  ? "bg-red-600 text-white"
                  : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
              )}>
                {optionLabels[index]}
              </div>
              <span className="flex-1">{option.text}</span>
              {index === correctIndex && <CheckCircle className="w-5 h-5 text-green-600" />}
              {index === userSelectedIndex && index !== correctIndex && <XCircle className="w-5 h-5 text-red-600" />}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Quiz Review</h2>
        <Button
          onClick={onBackToResults}
          variant="outline"
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Results</span>
        </Button>
      </div>

      {/* Questions Review */}
      <div className="space-y-6">
        {questions.map((question, index) => {
          const userAnswer = userAnswers.get(index);
          const isCorrect = userAnswer?.isCorrect ?? false;

          return (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    Question {index + 1}
                  </CardTitle>
                  <Badge
                    variant={isCorrect ? "default" : "destructive"}
                    className={cn(
                      "flex items-center space-x-1",
                      isCorrect
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-red-600 hover:bg-red-700"
                    )}
                  >
                    {isCorrect ? (
                      <CheckCircle className="w-3 h-3" />
                    ) : (
                      <XCircle className="w-3 h-3" />
                    )}
                    <span>{isCorrect ? 'Correct' : 'Incorrect'}</span>
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Question Content */}
                {question.type === 'TRUE_FALSE' 
                  ? renderTrueFalseReview(question, index)
                  : renderMCQReview(question, index)
                }
                
                {/* Explanation */}
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                    Explanation:
                  </h4>
                  <p className="text-blue-800 dark:text-blue-200 leading-relaxed">
                    {question.explanation}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
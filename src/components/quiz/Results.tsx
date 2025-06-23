import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, Target, CheckCircle, XCircle, Eye } from 'lucide-react';

interface QuizResultsProps {
  score: number;
  totalQuestions: number;
  onReviewAnswers: () => void;
  onRetakeQuiz: () => void;
}

export const QuizResults: React.FC<QuizResultsProps> = ({
  score,
  totalQuestions,
  onReviewAnswers,
  onRetakeQuiz
}) => {
  const percentage = Math.round((score / totalQuestions) * 100);
  const incorrectAnswers = totalQuestions - score;

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600 dark:text-green-400';
    if (percentage >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getScoreMessage = (percentage: number) => {
    if (percentage >= 90) return 'Excellent work! 🎉';
    if (percentage >= 80) return 'Great job! 👏';
    if (percentage >= 70) return 'Good effort! 👍';
    if (percentage >= 60) return 'Keep practicing! 💪';
    return 'More study needed 📚';
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <Trophy className="w-16 h-16 text-yellow-500" />
          </div>
          <CardTitle className="text-3xl font-bold">Quiz Complete!</CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-8">
          {/* Score Display */}
          <div className="space-y-4">
            <div className={`text-6xl font-bold ${getScoreColor(percentage)}`}>
              {percentage}%
            </div>
            <div className="text-xl text-muted-foreground">
              {score} out of {totalQuestions} correct
            </div>
            <div className="text-lg font-medium">
              {getScoreMessage(percentage)}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <Target className="w-8 h-8 mx-auto mb-2 text-blue-600 dark:text-blue-400" />
                <div className="text-2xl font-bold">{totalQuestions}</div>
                <div className="text-sm text-muted-foreground">Total Questions</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-600 dark:text-green-400" />
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {score}
                </div>
                <div className="text-sm text-muted-foreground">Correct</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <XCircle className="w-8 h-8 mx-auto mb-2 text-red-600 dark:text-red-400" />
                <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {incorrectAnswers}
                </div>
                <div className="text-sm text-muted-foreground">Incorrect</div>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={onReviewAnswers}
              size="lg"
              className="flex items-center space-x-2"
            >
              <Eye className="w-4 h-4" />
              <span>Review Answers</span>
            </Button>
            
            <Button
              onClick={onRetakeQuiz}
              variant="outline"
              size="lg"
              className="flex items-center space-x-2"
            >
              <Trophy className="w-4 h-4" />
              <span>Retake Quiz</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
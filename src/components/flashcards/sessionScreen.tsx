import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Trophy, CheckCircle, XCircle, RotateCcw, Home, Target } from 'lucide-react';
import { StudySession } from '@/lib/types';

interface sessionScreenProps {
  isOpen: boolean;
  session: StudySession;
  onStudyAgain: () => void;
  onReturnToPack: () => void;
}

export const SessionScreen: React.FC<sessionScreenProps> = ({
  isOpen,
  session,
  onStudyAgain,
  onReturnToPack
}) => {
  const accuracy = session.totalCards > 0
    ? Math.round((session.correctCount / session.totalCards) * 100)
    : 0;

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 80) return 'text-green-600 dark:text-green-400';
    if (accuracy >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getAccuracyMessage = (accuracy: number) => {
    if (accuracy >= 90) return 'Excellent work! 🎉';
    if (accuracy >= 80) return 'Great job! 👏';
    if (accuracy >= 70) return 'Good progress! 👍';
    if (accuracy >= 60) return 'Keep practicing! 💪';
    return 'More review needed 📚';
  };

  const statsItems = [
    {
      icon: <Target className="w-6 h-6 mx-auto mb-2 text-blue-600 dark:text-blue-400" />,
      value: session.totalCards,
      label: "Total Cards"
    },
    {
      icon: <CheckCircle className="w-6 h-6 mx-auto mb-2 text-green-600 dark:text-green-400" />,
      value: session.correctCount,
      label: "Correct",
      valueColor: "text-green-600 dark:text-green-400"
    },
    {
      icon: <XCircle className="w-6 h-6 mx-auto mb-2 text-red-600 dark:text-red-400" />,
      value: session.wrongCount,
      label: "Need Review",
      valueColor: "text-red-600 dark:text-red-400"
    },
    {
      icon: null,
      value: `${accuracy}%`,
      label: "Accuracy",
      valueColor: getAccuracyColor(accuracy)
    }
  ]

  return (
    <Dialog open={isOpen} onOpenChange={() => { }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center flex items-center justify-center space-x-2">
            <Trophy className="w-6 h-6 text-yellow-500" />
            <span>Session Complete!</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Accuracy Score */}
          <div className="text-center">
            <div className={`text-4xl font-bold ${getAccuracyColor(accuracy)}`}>
              {accuracy}%
            </div>
            <p className="text-lg font-medium mt-2">
              {getAccuracyMessage(accuracy)}
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-4">
            {statsItems.map((item, index) => (
              <Card key={index}>
                <CardContent className="p-4 text-center">
                  {item.icon}
                  <div className={`text-2xl font-bold ${item.valueColor || ''}`}>
                    {item.value}
                  </div>
                  <div className="text-sm text-muted-foreground">{item.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col space-y-3">
            <Button
              onClick={onStudyAgain}
              className="w-full flex items-center justify-center space-x-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Study Again</span>
            </Button>

            <Button
              onClick={onReturnToPack}
              variant="outline"
              className="w-full flex items-center justify-center space-x-2"
            >
              <Home className="w-4 h-4" />
              <span>Return to Pack</span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
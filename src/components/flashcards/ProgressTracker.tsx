import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, XCircle, Eye, Clock } from 'lucide-react';
import { StudySession } from '@/lib/types';

interface ProgressTrackerProps {
  session: StudySession;
  filteredCardsLength: number;
}

export const ProgressTracker: React.FC<ProgressTrackerProps> = ({
  session,
  filteredCardsLength
}) => {
  const progressPercentage = filteredCardsLength > 0
    ? (session.completedCards.size / filteredCardsLength) * 100
    : 0;

  const remaining = filteredCardsLength - session.completedCards.size;

  const statsItems = [
    {
      icon: Clock,
      label: "Remaining",
      value: remaining,
      className: "bg-gray-50 dark:bg-gray-800",
      iconClass: "text-gray-600 dark:text-gray-400",
      valueClass: "text-gray-600 dark:text-gray-400"
    },
    {
      icon: CheckCircle,
      label: "Correct",
      value: session.correctCount,
      className: "bg-green-50 dark:bg-green-900/20",
      iconClass: "text-green-600 dark:text-green-400",
      valueClass: "text-green-600 dark:text-green-400"
    },
    {
      icon: XCircle,
      label: "Need Review",
      value: session.wrongCount,
      className: "bg-red-50 dark:bg-red-900/20",
      iconClass: "text-red-600 dark:text-red-400",
      valueClass: "text-red-600 dark:text-red-400"
    }
  ];

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="space-y-4">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm font-medium">
              <span>Session Progress</span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center space-x-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <Eye className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <div>
                <p className="text-xs text-muted-foreground">Cards Seen</p>
                <p className="font-semibold text-blue-600 dark:text-blue-400">
                  {session.completedCards.size}
                </p>
              </div>
            </div>
            {statsItems.map((item, index) => (
              <div key={index} className={`flex items-center space-x-2 p-3 ${item.className} rounded-lg`}>
                <item.icon className={`w-4 h-4 ${item.iconClass}`} />
                <div>
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                  <p className={`font-semibold ${item.valueClass}`}>
                    {item.value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
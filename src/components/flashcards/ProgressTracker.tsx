import React from 'react';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, XCircle, Eye, Clock, Target } from 'lucide-react';
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
      icon: Target,
      label: "Total Cards",
      value: filteredCardsLength,
      className: "bg-gray-50 border-gray-200 text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300",
      iconClass: "text-gray-600 dark:text-gray-400"
    },
    {
      icon: Eye,
      label: "Completed",
      value: session.completedCards.size,
      className: "bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-950 dark:border-blue-800 dark:text-blue-300",
      iconClass: "text-blue-600 dark:text-blue-400"
    },
    {
      icon: CheckCircle,
      label: "Correct",
      value: session.correctCount,
      className: "bg-green-50 border-green-200 text-green-700 dark:bg-green-950 dark:border-green-800 dark:text-green-300",
      iconClass: "text-green-600 dark:text-green-400"
    },
    {
      icon: XCircle,
      label: "Review",
      value: session.wrongCount,
      className: "bg-red-50 border-red-200 text-red-700 dark:bg-red-950 dark:border-red-800 dark:text-red-300",
      iconClass: "text-red-600 dark:text-red-400"
    },
    {
      icon: Clock,
      label: "Remaining",
      value: remaining,
      className: "bg-orange-50 border-orange-200 text-orange-700 dark:bg-orange-950 dark:border-orange-800 dark:text-orange-300",
      iconClass: "text-orange-600 dark:text-orange-400"
    }
  ];

  return (
    <div className="space-y-4 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 mb-6">
      {/* Progress Section */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <Target className="w-4 h-4" />
          <span className="font-medium">Progress:</span>
          <span>{Math.round(progressPercentage)}%</span>
        </div>
        
        <div className="flex-1">
          <Progress value={progressPercentage} className="h-2" />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {statsItems.map((item, index) => (
          <div
            key={index}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all duration-200 ${item.className}`}
          >
            <item.icon className={`w-4 h-4 ${item.iconClass}`} />
            <div className="text-sm">
              <span className="font-medium">{item.value}</span>
              <span className="ml-1 opacity-70">{item.label}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
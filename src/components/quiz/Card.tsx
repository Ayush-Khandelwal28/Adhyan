import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  HelpCircle, 
  CheckCircle, 
  Clock, 
  Calendar, 
  Target,
  TrendingUp,
  Play,
  BarChart3
} from 'lucide-react';
import { QuizData } from '@/lib/types'; 
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

interface QuizCardProps {
  quiz: QuizData;
  onStartQuiz: (quizId: string) => void;
}

export const QuizCard: React.FC<QuizCardProps> = ({ quiz, onStartQuiz }) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'MCQ':
        return <HelpCircle className="w-4 h-4" />;
      case 'TRUE_FALSE':
        return <CheckCircle className="w-4 h-4" />;
      case 'MIXED':
        return <BarChart3 className="w-4 h-4" />;
      default:
        return <HelpCircle className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'MCQ':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'TRUE_FALSE':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'MIXED':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'Hard':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getScoreColor = (score?: number) => {
    if (!score) return 'text-gray-500';
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const router = useRouter();

  return (
    <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm group" onClick={() => router.push(`/studypack/${quiz.id}/quiz/${quiz.id}`)}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className={cn("flex items-center space-x-1", getTypeColor(quiz.type))}>
              {getTypeIcon(quiz.type)}
              <span>{quiz.type}</span>
            </Badge>
            <Badge variant="outline" className={getDifficultyColor(quiz.difficulty)}>
              {quiz.difficulty}
            </Badge>
          </div>
          <div className="text-xs text-muted-foreground">
            <Calendar className="h-3 w-3 inline mr-1" />
            {formatDate(quiz.createdAt)}
          </div>
        </div>
        
        <CardTitle className="text-lg font-bold line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {quiz.title}
        </CardTitle>
        
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <div className="flex items-center space-x-1">
            <Target className="h-3 w-3" />
            <span>{quiz.questionCount} questions</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
              {quiz.totalAttempts}
            </div>
            <div className="text-xs text-muted-foreground">Attempts</div>
          </div>
          
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 text-center">
            <div className={cn("text-lg font-bold", getScoreColor(quiz.lastScore))}>
              {quiz.lastScore ? `${quiz.lastScore}/${quiz.questionCount}` : 'N/A'}
            </div>
            <div className="text-xs text-muted-foreground">Last Score</div>
          </div>
        </div>

        {/* Last Attempted */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Last attempted:</span>
          <span className="font-medium">{formatDate(quiz.lastAttempted)}</span>
        </div>

        {/* Action Button */}
        <Button 
          onClick={() => onStartQuiz(quiz.id)}
          className="w-full flex items-center justify-center space-x-2 mt-4"
        >
          <Play className="w-4 h-4" />
          <span>Start Quiz</span>
        </Button>
      </CardContent>
    </Card>
  );
};
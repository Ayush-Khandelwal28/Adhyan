'use client';

import React, { useState, useEffect, useMemo, use } from 'react';
import { AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

import { QuizCard } from '@/components/quiz/Card';
import { QuizFiltersComponent } from '@/components/quiz/Filters';
import { NewQuizDialog } from '@/components/quiz/NewQuiz';

import { QuizFilters, QuizSortOption, NewQuizRequest, QuizData } from '@/lib/types';

export default function QuizzesPage({ params }: { params: Promise<{ id: string }> }) {
  const [quizzes, setQuizzes] = useState<QuizData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatingQuiz, setIsCreatingQuiz] = useState(false);

  // Filter and sort state
  const [filters, setFilters] = useState<QuizFilters>({
    type: 'ALL',
    difficulty: 'ALL'
  });

  const [sortOption, setSortOption] = useState<QuizSortOption>({
    field: 'lastAttempted',
    direction: 'desc'
  });

  const { id } = use(params);

  const getQuizzes = async (id: string) => {
    console.log('Fetching quizzes for study pack ID:', id);
    try {
      const response = await fetch(`/api/quiz/all?studyPackId=${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error(`Error fetching quizzes: ${response.statusText}`);
      }
      const data = await response.json();
      console.log('Quizzes fetched successfully:', data.data);
      setQuizzes(data.data || []);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
      setQuizzes([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Load quizzes data
  useEffect(() => {
    getQuizzes(id).catch(error => {
      console.error('Error loading quizzes:', error);
      setIsLoading(false);
    });
  }, [id]);

  // Filter and sort quizzes
  const filteredAndSortedQuizzes = useMemo(() => {
    if (!quizzes || quizzes.length === 0) return [];
    const filtered = quizzes.filter(quiz => {
      if (!quiz) return false;
      const typeMatch = filters.type === 'ALL' || quiz.type === filters.type;
      const difficultyMatch = filters.difficulty === 'ALL' || quiz.difficulty === filters.difficulty;
      return typeMatch && difficultyMatch;
    });

    // Sort quizzes
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sortOption.field) {
        case 'lastAttempted':
          aValue = a.lastAttempted ? new Date(a.lastAttempted).getTime() : 0;
          bValue = b.lastAttempted ? new Date(b.lastAttempted).getTime() : 0;
          break;
        case 'createdAt':
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        case 'lastScore':
          aValue = a.lastScore || 0;
          bValue = b.lastScore || 0;
          break;
        default:
          return 0;
      }

      if (sortOption.direction === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [quizzes, filters, sortOption]);

  const handleCreateQuiz = async (request: NewQuizRequest) => {
    setIsCreatingQuiz(true);
    try {
      const response = await fetch('/api/quiz/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studyPackId: id,
          quizTitle: request.title || `${request.difficulty || 'General'} ${request.type || 'Quiz'} - ${new Date().toISOString().split('T')[0]}`,
          quizType: request.type,
          questionCount: request.questionCount,
          difficulty: request.difficulty
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create quiz');
      }

      const result = await response.json();

      console.log('Quiz created successfully:', result);

      // Add the new quiz to the state
      const newQuiz: QuizData = {
        id: result.data.id,
        title: result.data.title,
        type: result.data.type,
        questionCount: result.data.questionCount,
        totalAttempts: 0,
        createdAt: result.data.createdAt,
        difficulty: result.data.difficulty,
      };

      setQuizzes(prev => [newQuiz, ...prev]);
    } catch (error) {
      console.error('Error creating quiz:', error);
    } finally {
      setIsCreatingQuiz(false);
    }
  };

  // const router = useRouter();
  const handleStartQuiz = (quizId: string) => {
    return () => {
      // Store the URL
      const targetUrl = `/studypack/${id}/quiz/${quizId}`;

      // Debug logs
      console.log('Study Pack ID:', id);
      console.log('Quiz ID:', quizId);
      console.log('Target URL:', targetUrl);
      window.location.href = targetUrl;
    };
  };

  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-6 py-8">
        {/* Action Bar */}
        <div className="flex justify-end mb-6">
          <NewQuizDialog
            onCreateQuiz={handleCreateQuiz}
            isCreating={isCreatingQuiz}
          />
        </div>

        {/* Filters and Sorting */}
        <QuizFiltersComponent
          filters={filters}
          sortOption={sortOption}
          onFiltersChange={setFilters}
          onSortChange={setSortOption}
          totalQuizzes={quizzes.length}
          filteredCount={filteredAndSortedQuizzes.length}
        />

        {/* Quizzes Grid */}
        {filteredAndSortedQuizzes.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {quizzes.length === 0 ? 'No Quizzes Yet' : 'No Quizzes Match Your Filters'}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                {quizzes.length === 0
                  ? 'Generate your first quiz to start testing your knowledge.'
                  : 'Try adjusting your filters or create a new quiz.'
                }
              </p>
              <NewQuizDialog
                onCreateQuiz={handleCreateQuiz}
                isCreating={isCreatingQuiz}
              />
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedQuizzes.map((quiz) => (
              <QuizCard
                key={quiz.id}
                quiz={quiz}
                onStartQuiz={handleStartQuiz(quiz.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
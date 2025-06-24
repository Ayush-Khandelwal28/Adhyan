'use client';

import React, { useState, useEffect, use } from 'react';
import { QuizHeader } from '@/components/quiz/Header';
import { TrueFalseQuestion } from '@/components/quiz/TrueFalse';
import { MCQQuestion } from '@/components/quiz/MCQ';
import { QuizNavigation } from '@/components/quiz/Navigation';
import { QuizResults } from '@/components/quiz/Results';
import { QuizReview } from '@/components/quiz/Review';
import { QuizState, UserAnswer, QuizPhase, Quiz } from '@/lib/types';

export default function QuizPage({ params }: { params: Promise<{ quizId: string }> }) {
  const [quizState, setQuizState] = useState<QuizState>({
    currentQuestionIndex: 0,
    userAnswers: new Map(),
    isCompleted: false,
    showResults: false,
    showReview: false,
    score: 0
  });
  const [quizData, setQuizData] = useState<Quiz>();
  const [isLoading, setIsLoading] = useState(true);
  const [currentPhase, setCurrentPhase] = useState<QuizPhase>('taking');


  const { quizId } = use(params);

  const getQuizData = async (quizId: string) => {
    try {
      const response = await fetch(`/api/quiz?quizId=${quizId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch quiz data');
      }
      const { data } = await response.json();
      console.log('Fetched quiz data:', data);
      setQuizData(data);
    } catch (error) {
      console.error('Error fetching quiz:', error);
      return null;
    }
  };

  useEffect(() => {
    const fetchQuiz = async () => {
      setIsLoading(true);
      const data = await getQuizData(quizId);
      if (data) {
        setQuizData(data);
      }
      setIsLoading(false);
    };
    fetchQuiz();
  }, [quizId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center">Loading quiz...</div>
        </div>
      </div>
    );
  }

  if (!quizData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center text-red-600">Failed to load quiz</div>
        </div>
      </div>
    );
  }

  const progress = ((quizState.currentQuestionIndex) / quizData.totalQuestions) * 100;


  const handleAnswerSelect = (answer: boolean | number) => {
    const currentQuestion = quizData.questions[quizState.currentQuestionIndex];
    let isCorrect = false;

    if (currentQuestion.type === 'TRUE_FALSE') {
      isCorrect = (answer as boolean) === currentQuestion.isTrue;
    } else if (currentQuestion.type === 'MCQ') {
      isCorrect = currentQuestion.options[answer as number]?.isCorrect || false;
    }

    const userAnswer: UserAnswer = {
      questionIndex: quizState.currentQuestionIndex,
      answer,
      isCorrect
    };

    setQuizState(prev => ({
      ...prev,
      userAnswers: new Map(prev.userAnswers).set(quizState.currentQuestionIndex, userAnswer)
    }));
  };

  const handlePrevious = () => {
    if (quizState.currentQuestionIndex > 0) {
      setQuizState(prev => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex - 1
      }));
    }
  };

  const handleNext = () => {
    if (quizState.currentQuestionIndex < quizData.totalQuestions - 1) {
      setQuizState(prev => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1
      }));
    }
  };

  const handleFinish = async () => {
  const score = Array.from(quizState.userAnswers.values())
    .filter(answer => answer.isCorrect).length;

  try {
    // Save quiz results to API
    const response = await fetch('/api/quiz/finish', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        quizId,
        score,
      })
    });

    if (!response.ok) {
      console.error('Failed to save quiz results');
    }

    // Update quiz state after saving results
    setQuizState(prev => ({
      ...prev,
      isCompleted: true,
      showResults: true,
      score
    }));
    setCurrentPhase('results');
  } catch (error) {
    console.error('Error saving quiz results:', error);
    // Still show results even if saving fails
    setQuizState(prev => ({
      ...prev,
      isCompleted: true,
      showResults: true,
      score
    }));
    setCurrentPhase('results');
  }
};

  const handleReviewAnswers = () => {
    setQuizState(prev => ({
      ...prev,
      showReview: true
    }));
    setCurrentPhase('review');
  };

  const handleBackToResults = () => {
    setQuizState(prev => ({
      ...prev,
      showReview: false
    }));
    setCurrentPhase('results');
  };

  const handleRetakeQuiz = () => {
    setQuizState({
      currentQuestionIndex: 0,
      userAnswers: new Map(),
      isCompleted: false,
      showResults: false,
      showReview: false,
      score: 0
    });
    setCurrentPhase('taking');
  };

  const currentQuestion = quizData.questions[quizState.currentQuestionIndex];
  const currentUserAnswer = quizState.userAnswers.get(quizState.currentQuestionIndex);

  const canGoBack = quizState.currentQuestionIndex > 0;
  const canGoForward = quizState.currentQuestionIndex < quizData.totalQuestions - 1;
  const isLastQuestion = quizState.currentQuestionIndex === quizData.totalQuestions - 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-6 py-8">

        {/* Quiz Content */}
        {currentPhase === 'taking' && (
          <div className="space-y-8">
            <QuizHeader
              title={quizData.title}
              currentQuestion={quizState.currentQuestionIndex + 1}
              totalQuestions={quizData.totalQuestions}
              progress={progress}
            />

            <div className="space-y-8">
              {currentQuestion.type === 'TRUE_FALSE' ? (
                <TrueFalseQuestion
                  question={currentQuestion}
                  selectedAnswer={currentUserAnswer?.answer as boolean}
                  onAnswerSelect={handleAnswerSelect}
                  questionNumber={quizState.currentQuestionIndex + 1}
                />
              ) : (
                <MCQQuestion
                  question={currentQuestion}
                  selectedAnswer={currentUserAnswer?.answer as number}
                  onAnswerSelect={handleAnswerSelect}
                  questionNumber={quizState.currentQuestionIndex + 1}
                />
              )}

              <QuizNavigation
                currentQuestion={quizState.currentQuestionIndex + 1}
                totalQuestions={quizData.totalQuestions}
                onPrevious={handlePrevious}
                onNext={handleNext}
                onFinish={handleFinish}
                canGoBack={canGoBack}
                canGoForward={canGoForward}
                isLastQuestion={isLastQuestion}
              />
            </div>
          </div>
        )}

        {currentPhase === 'results' && (
          <QuizResults
            score={quizState.score}
            totalQuestions={quizData.totalQuestions}
            onReviewAnswers={handleReviewAnswers}
            onRetakeQuiz={handleRetakeQuiz}
          />
        )}

        {currentPhase === 'review' && (
          <QuizReview
            questions={quizData.questions}
            userAnswers={quizState.userAnswers}
            onBackToResults={handleBackToResults}
          />
        )}
      </div>
    </div>
  );
}
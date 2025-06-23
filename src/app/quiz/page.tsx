'use client';

import React, { useState, useEffect } from 'react';
import { QuizHeader } from '@/components/quiz/Header';
import { TrueFalseQuestion } from '@/components/quiz/TrueFalse';
import { MCQQuestion } from '@/components/quiz/MCQ';
import { QuizNavigation } from '@/components/quiz/Navigation';
import { QuizResults } from '@/components/quiz/Results';
import { QuizReview } from '@/components/quiz/Review';
import { QuizState, UserAnswer, QuizPhase } from '@/lib/types';
import { mockQuizData } from '@/lib/mockdata/quiz';

export default function QuizPage() {
  const [quizState, setQuizState] = useState<QuizState>({
    currentQuestionIndex: 0,
    userAnswers: new Map(),
    isCompleted: false,
    showResults: false,
    showReview: false,
    score: 0
  });

  const [currentPhase, setCurrentPhase] = useState<QuizPhase>('taking');
  const progress = ((quizState.currentQuestionIndex) / mockQuizData.totalQuestions) * 100;

  const handleAnswerSelect = (answer: boolean | number) => {
    const currentQuestion = mockQuizData.questions[quizState.currentQuestionIndex];
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
    if (quizState.currentQuestionIndex < mockQuizData.totalQuestions - 1) {
      setQuizState(prev => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1
      }));
    }
  };

  const handleFinish = () => {
    const score = Array.from(quizState.userAnswers.values())
      .filter(answer => answer.isCorrect).length;

    setQuizState(prev => ({
      ...prev,
      isCompleted: true,
      showResults: true,
      score
    }));
    setCurrentPhase('results');
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

  const currentQuestion = mockQuizData.questions[quizState.currentQuestionIndex];
  const currentUserAnswer = quizState.userAnswers.get(quizState.currentQuestionIndex);

  const canGoBack = quizState.currentQuestionIndex > 0;
  const canGoForward = quizState.currentQuestionIndex < mockQuizData.totalQuestions - 1;
  const isLastQuestion = quizState.currentQuestionIndex === mockQuizData.totalQuestions - 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-6 py-8">

        {/* Quiz Content */}
        {currentPhase === 'taking' && (
          <div className="space-y-8">
            <QuizHeader
              title={mockQuizData.title}
              currentQuestion={quizState.currentQuestionIndex + 1}
              totalQuestions={mockQuizData.totalQuestions}
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
                totalQuestions={mockQuizData.totalQuestions}
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
            totalQuestions={mockQuizData.totalQuestions}
            onReviewAnswers={handleReviewAnswers}
            onRetakeQuiz={handleRetakeQuiz}
          />
        )}

        {currentPhase === 'review' && (
          <QuizReview
            questions={mockQuizData.questions}
            userAnswers={quizState.userAnswers}
            onBackToResults={handleBackToResults}
          />
        )}
      </div>
    </div>
  );
}
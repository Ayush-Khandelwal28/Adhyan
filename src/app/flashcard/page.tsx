'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Brain, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Filters } from '@/components/flashcards/Filters';
import { ProgressTracker } from '@/components/flashcards/ProgressTracker';
import { FlashcardComponent } from '@/components/flashcards/Flashcard';
import { ActionMenu } from '@/components/flashcards/ActionMenu';
import { SessionScreen } from '@/components/flashcards/sessionScreen';
import { Flashcard, FlashcardData, StudySession, FilterState } from '@/lib/types';
import flashcardsData from '@/lib/mockdata/flashcard2.json';

const sampleData: FlashcardData = flashcardsData as FlashcardData;

export default function FlashcardPage() {
  const [filters, setFilters] = useState<FilterState>({
    definitions: true,
    recall: true,
    application: true
  });

  const [session, setSession] = useState<StudySession>({
    totalCards: 0,
    currentIndex: 0,
    correctCount: 0,
    wrongCount: 0,
    completedCards: new Set(),
    needReviewCards: new Set()
  });

  const [shuffledCards, setShuffledCards] = useState<Flashcard[]>([]);
  const [isSessionComplete, setIsSessionComplete] = useState(false);

  const allCards = useMemo(() => {
    const cards: Flashcard[] = [];
    sampleData.data.forEach(group => {
      group.flashcards.forEach(card => {
        cards.push(card);
      });
    });
    return cards;
  }, []);

  const filteredCards = useMemo(() => {
    return allCards.filter(card => {
      switch (card.type) {
        case 'definition':
          return filters.definitions;
        case 'recall':
          return filters.recall;
        case 'application':
          return filters.application;
        default:
          return false;
      }
    });
  }, [allCards, filters]);

  const cardCounts = useMemo(() => {
    return {
      definitions: allCards.filter(card => card.type === 'definition').length,
      recall: allCards.filter(card => card.type === 'recall').length,
      application: allCards.filter(card => card.type === 'application').length
    };
  }, [allCards]);

  useEffect(() => {
    if (filteredCards.length > 0) {
      setShuffledCards([...filteredCards]);
      setSession({
        totalCards: filteredCards.length,
        currentIndex: 0,
        correctCount: 0,
        wrongCount: 0,
        completedCards: new Set(),
        needReviewCards: new Set()
      });
      setIsSessionComplete(false);
    }
  }, [filteredCards]);

  const hasActiveFilters = filters.definitions || filters.recall || filters.application;

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  const handleAnswer = (correct: boolean) => {
    const currentCardIndex = session.currentIndex;
    const newCompletedCards = new Set(session.completedCards);
    const newNeedReviewCards = new Set(session.needReviewCards);
    
    newCompletedCards.add(currentCardIndex);
    
    if (!correct) {
      newNeedReviewCards.add(currentCardIndex);
    }

    const newSession = {
      ...session,
      correctCount: correct ? session.correctCount + 1 : session.correctCount,
      wrongCount: correct ? session.wrongCount : session.wrongCount + 1,
      completedCards: newCompletedCards,
      needReviewCards: newNeedReviewCards
    };

    if (newCompletedCards.size >= shuffledCards.length) {
      setIsSessionComplete(true);
    } else {
      let nextIndex = (currentCardIndex + 1) % shuffledCards.length;
      while (newCompletedCards.has(nextIndex) && newCompletedCards.size < shuffledCards.length) {
        nextIndex = (nextIndex + 1) % shuffledCards.length;
      }
      newSession.currentIndex = nextIndex;
    }

    setSession(newSession);
  };

  const handleShuffle = () => {
    const remainingIndices = Array.from({ length: shuffledCards.length }, (_, i) => i)
      .filter(i => !session.completedCards.has(i));
    
    if (remainingIndices.length > 1) {
      // Fisher-Yates shuffle for remaining indices
      for (let i = remainingIndices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [remainingIndices[i], remainingIndices[j]] = [remainingIndices[j], remainingIndices[i]];
      }
      
      setSession(prev => ({
        ...prev,
        currentIndex: remainingIndices[0]
      }));
    }
  };

  const handleRestart = () => {
    setSession({
      totalCards: shuffledCards.length,
      currentIndex: 0,
      correctCount: 0,
      wrongCount: 0,
      completedCards: new Set(),
      needReviewCards: new Set()
    });
    setIsSessionComplete(false);
    
    const newShuffled = [...shuffledCards];
    for (let i = newShuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newShuffled[i], newShuffled[j]] = [newShuffled[j], newShuffled[i]];
    }
    setShuffledCards(newShuffled);
  };

  const handleReturnToPack = () => {
    console.log('Returning to pack...');
  };

  const handleStudyAgain = () => {
    handleRestart();
  };

  const currentCard = shuffledCards[session.currentIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <Brain className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Machine Learning Flashcards
            </h1>
          </div>
        </div>

        <Filters
          filters={filters}
          onFilterChange={handleFilterChange}
          cardCounts={cardCounts}
        />

        {/* Main Content */}
        {!hasActiveFilters ? (
          // No filters selected
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-12 text-center">
              <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Select at least one card type</h3>
              <p className="text-muted-foreground">
                Choose from Definitions, Recall Questions, or Application-Based cards to start studying.
              </p>
            </CardContent>
          </Card>
        ) : filteredCards.length === 0 ? (
          // No cards match filters
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-12 text-center">
              <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No cards found</h3>
              <p className="text-muted-foreground">
                No flashcards match your current filter selection.
              </p>
            </CardContent>
          </Card>
        ) : (
          // Study interface
          <div className="space-y-6">
            {/* Progress Tracker */}
            <ProgressTracker 
              session={session} 
              filteredCardsLength={shuffledCards.length} 
            />

            {/* Action Menu */}
            <ActionMenu
              onShuffle={handleShuffle}
              onRestart={handleRestart}
              onReturnToPack={handleReturnToPack}
              disabled={isSessionComplete}
            />

            {/* Current Flashcard */}
            {currentCard && !isSessionComplete && (
              <FlashcardComponent
                card={currentCard}
                onAnswer={handleAnswer}
                cardNumber={session.completedCards.size + 1}
                totalCards={shuffledCards.length}
              />
            )}
          </div>
        )}

        {/* Session Complete Modal */}
        <SessionScreen
          isOpen={isSessionComplete}
          session={session}
          onStudyAgain={handleStudyAgain}
          onReturnToPack={handleReturnToPack}
        />
      </div>
    </div>
  );
}
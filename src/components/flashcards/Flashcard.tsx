import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Brain, Lightbulb, RotateCcw, CheckCircle, XCircle } from 'lucide-react';
import { Flashcard } from '@/lib/types';
import { cn } from '@/lib/utils';

interface FlashcardComponentProps {
  card: Flashcard;
  onAnswer: (correct: boolean) => void;
  cardNumber: number;
  totalCards: number;
}

export const FlashcardComponent: React.FC<FlashcardComponentProps> = ({
  card,
  onAnswer,
  cardNumber,
  totalCards
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  
  // Reset the flip state when the card changes
  // This uses the card's front text as a dependency to identify card changes
  useEffect(() => {
    setIsFlipped(false);
  }, [card.front]);

  const getCardStyle = (type: string) => {
    switch (type) {
      case 'definition':
        return 'border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20';
      case 'recall':
        return 'border-green-200 dark:border-green-800 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20';
      case 'application':
        return 'border-purple-200 dark:border-purple-800 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20';
      default:
        return 'border-gray-200 dark:border-gray-800';
    }
  };

  const getIcon = (type: string) => {
    const iconClass = "w-5 h-5";
    switch (type) {
      case 'definition':
        return <BookOpen className={cn(iconClass, "text-blue-600 dark:text-blue-400")} />;
      case 'recall':
        return <Brain className={cn(iconClass, "text-green-600 dark:text-green-400")} />;
      case 'application':
        return <Lightbulb className={cn(iconClass, "text-purple-600 dark:text-purple-400")} />;
      default:
        return null;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'definition':
        return 'Definition';
      case 'recall':
        return 'Recall Question';
      case 'application':
        return 'Application-Based';
      default:
        return type;
    }
  };

  const handleCardClick = () => {
    if (!isFlipped) {
      setIsFlipped(true);
    }
  };

  const handleAnswer = (correct: boolean) => {
    setIsFlipped(false);
    
    setTimeout(() => {
      onAnswer(correct);
    }, 50);
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Card Counter */}
      <div className="text-center mb-4">
        <span className="text-sm text-muted-foreground">
          Card {cardNumber} of {totalCards}
        </span>
      </div>

      {/* Main Card Container */}
      <div className="perspective-1000 h-[450px]">
        <div 
          className={cn(
            "relative w-full h-full transition-transform duration-300 transform-style-preserve-3d cursor-pointer",
            isFlipped && "rotate-y-180"
          )}
          onClick={handleCardClick}
        >
          {/* Front of card */}
          <Card className={cn(
            "absolute inset-0 backface-hidden hover:shadow-xl transition-shadow duration-300",
            getCardStyle(card.type)
          )}>
            <CardContent className="p-8 h-full flex flex-col">
              {/* Card Type Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                  {getIcon(card.type)}
                  <span className="font-medium text-sm uppercase tracking-wide">
                    {getTypeLabel(card.type)}
                  </span>
                </div>
                <RotateCcw className="w-4 h-4 text-muted-foreground" />
              </div>

              {/* Question - Centered */}
              <div className="flex-1 flex items-center justify-center px-4">
                <p className="text-lg md:text-xl font-medium text-center leading-relaxed">
                  {card.front}
                </p>
              </div>

              {/* Click to flip hint */}
              <div className="text-center mt-6">
                <p className="text-sm text-muted-foreground">
                  Click to reveal answer
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Back of card */}
          <Card className={cn(
            "absolute inset-0 backface-hidden rotate-y-180 hover:shadow-xl transition-shadow duration-300",
            getCardStyle(card.type)
          )}>
            <CardContent className="p-8 h-full flex flex-col">
              {/* Card Type Header */}
              <div className="flex items-center space-x-2 mb-6">
                {getIcon(card.type)}
                <span className="font-medium text-sm uppercase tracking-wide">
                  {getTypeLabel(card.type)} - Answer
                </span>
              </div>

              {/* Answer - Centered */}
              <div className="flex-1 flex items-center justify-center px-4">
                <p className="text-base md:text-lg leading-relaxed text-center">
                  {card.back}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4 justify-center mt-6">
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAnswer(false);
                  }}
                  variant="outline"
                  className="flex items-center space-x-2 border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20 cursor-pointer"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Need Review</span>
                </Button>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAnswer(true);
                  }}
                  className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 cursor-pointer"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Got It</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Filter, BookOpen, Brain, Lightbulb, X } from 'lucide-react';
import { FilterState } from '@/lib/types';

interface FlashcardFiltersProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  cardCounts: {
    definitions: number;
    recall: number;
    application: number;
  };
}

export const Filters: React.FC<FlashcardFiltersProps> = ({
  filters,
  onFilterChange,
  cardCounts
}) => {
  const handleFilterChange = (type: keyof FilterState, checked: boolean) => {
    onFilterChange({
      ...filters,
      [type]: checked
    });
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'definitions':
        return <BookOpen className="w-4 h-4" />;
      case 'recall':
        return <Brain className="w-4 h-4" />;
      case 'application':
        return <Lightbulb className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getColorClasses = (type: string, isSelected: boolean) => {
    const baseClasses = "flex items-center gap-2 px-3 py-2 rounded-lg border transition-all duration-200 cursor-pointer";

    if (isSelected) {
      switch (type) {
        case 'definitions':
          return `${baseClasses} bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-950 dark:border-blue-800 dark:text-blue-300`;
        case 'recall':
          return `${baseClasses} bg-green-50 border-green-200 text-green-700 dark:bg-green-950 dark:border-green-800 dark:text-green-300`;
        case 'application':
          return `${baseClasses} bg-purple-50 border-purple-200 text-purple-700 dark:bg-purple-950 dark:border-purple-800 dark:text-purple-300`;
        default:
          return `${baseClasses} bg-gray-50 border-gray-200 text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300`;
      }
    } else {
      return `${baseClasses} bg-white border-gray-200 text-gray-500 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-750`;
    }
  };

  const cardTypes = [
    { id: 'definitions', label: 'Definitions', count: cardCounts.definitions },
    { id: 'recall', label: 'Recall', count: cardCounts.recall },
    { id: 'application', label: 'Application', count: cardCounts.application }
  ];

  const hasActiveFilters = Object.values(filters).some(filter => !filter);

  const clearAllFilters = () => {
    onFilterChange({
      definitions: true,
      recall: true,
      application: true
    });
  };

  const totalCards = cardCounts.definitions + cardCounts.recall + cardCounts.application;
  const visibleCards = Object.entries(filters).reduce((sum, [type, enabled]) => {
    if (enabled) {
      return sum + cardCounts[type as keyof typeof cardCounts];
    }
    return sum;
  }, 0);

  return (
    <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 mb-6">
      {/* Left side - Filters */}
      <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <Filter className="w-4 h-4" />
          <span className="font-medium">Card Types:</span>
        </div>

        {cardTypes.map(({ id, label, count }) => {
          const isSelected = filters[id as keyof FilterState];
          return (
            <div
              key={id}
              className={getColorClasses(id, isSelected)}
              onClick={() => handleFilterChange(id as keyof FilterState, !isSelected)}
            >
              <Checkbox
                id={id}
                checked={isSelected}
                onCheckedChange={(checked) => handleFilterChange(id as keyof FilterState, checked as boolean)}
                className="pointer-events-none"
              />
              <span className="text-sm">
                {getIcon(id)}
              </span>
              <span className="text-sm font-medium">{label}</span>
              <span className="text-xs opacity-70">({count})</span>
            </div>
          );
        })}

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="h-8 px-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="w-3 h-3 mr-1" />
            Clear
          </Button>
        )}
      </div>

      {/* Right side - Results count */}
      <div className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap self-end xl:self-auto">
        {visibleCards === totalCards ? (
          <span>{totalCards} card{totalCards !== 1 ? 's' : ''}</span>
        ) : (
          <span>{visibleCards} of {totalCards} card{totalCards !== 1 ? 's' : ''}</span>
        )}
      </div>
    </div>
  );
};
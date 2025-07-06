import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Filter, SortAsc, SortDesc } from 'lucide-react';
import { QuizFilters, QuizSortOption } from '@/lib/types';
import { NewQuizDialog } from './NewQuiz';

interface QuizFiltersProps {
  filters: QuizFilters;
  sortOption: QuizSortOption;
  onFiltersChange: (filters: QuizFilters) => void;
  onSortChange: (sort: QuizSortOption) => void;
  totalQuizzes: number;
  filteredCount: number;
  onCreateQuiz?: (request: any) => Promise<void>;
  isCreatingQuiz?: boolean;
}

export const QuizFiltersComponent: React.FC<QuizFiltersProps> = ({
  filters,
  sortOption,
  onFiltersChange,
  onSortChange,
  totalQuizzes,
  filteredCount,
  onCreateQuiz,
  isCreatingQuiz = false
}) => {
  const handleTypeChange = (type: string) => {
    onFiltersChange({
      ...filters,
      type: type as QuizFilters['type']
    });
  };

  const handleDifficultyChange = (difficulty: string) => {
    onFiltersChange({
      ...filters,
      difficulty: difficulty as QuizFilters['difficulty']
    });
  };

  const handleSortFieldChange = (field: string) => {
    onSortChange({
      ...sortOption,
      field: field as QuizSortOption['field']
    });
  };

  const toggleSortDirection = () => {
    onSortChange({
      ...sortOption,
      direction: sortOption.direction === 'asc' ? 'desc' : 'asc'
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      type: 'ALL',
      difficulty: 'ALL'
    });
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 mb-6">
      {/* Left side - Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <Filter className="w-4 h-4" />
          <span className="font-medium">Filters:</span>
        </div>

        {/* Quiz Type Filter */}
        <Select value={filters.type} onValueChange={handleTypeChange}>
          <SelectTrigger className="w-[140px] h-8">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Types</SelectItem>
            <SelectItem value="MCQ">Multiple Choice</SelectItem>
            <SelectItem value="TRUE_FALSE">True/False</SelectItem>
          </SelectContent>
        </Select>

        {/* Difficulty Filter */}
        <Select value={filters.difficulty} onValueChange={handleDifficultyChange}>
          <SelectTrigger className="w-[120px] h-8">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Levels</SelectItem>
            <SelectItem value="Easy">Easy</SelectItem>
            <SelectItem value="Medium">Medium</SelectItem>
            <SelectItem value="Hard">Hard</SelectItem>
          </SelectContent>
        </Select>

        {/* Sort By */}
        <Select value={sortOption.field} onValueChange={handleSortFieldChange}>
          <SelectTrigger className="w-[140px] h-8">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="lastAttempted">Last Attempted</SelectItem>
            <SelectItem value="createdAt">Created Date</SelectItem>
            <SelectItem value="lastScore">Last Score</SelectItem>
          </SelectContent>
        </Select>

        {/* Sort Direction */}
        <Button
          variant="outline"
          size="sm"
          onClick={toggleSortDirection}
          className="h-8 px-3"
        >
          {sortOption.direction === 'asc' ? (
            <SortAsc className="w-4 h-4" />
          ) : (
            <SortDesc className="w-4 h-4" />
          )}
        </Button>

        {/* Clear Filters */}
        {(filters.type !== 'ALL' || filters.difficulty !== 'ALL') && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="h-8 px-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            Clear
          </Button>
        )}
      </div>

      {/* Right side - Results count and Generate button */}
      <div className="flex items-center gap-4">
        <div className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
          {filteredCount === totalQuizzes ? (
            <span>{totalQuizzes} quiz{totalQuizzes !== 1 ? 'es' : ''}</span>
          ) : (
            <span>{filteredCount} of {totalQuizzes} quiz{totalQuizzes !== 1 ? 'es' : ''}</span>
          )}
        </div>

        {onCreateQuiz && (
          <NewQuizDialog
            onCreateQuiz={onCreateQuiz}
            isCreating={isCreatingQuiz}
          />
        )}
      </div>
    </div>
  );
};
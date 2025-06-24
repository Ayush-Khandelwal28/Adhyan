import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Filter, SortAsc, SortDesc } from 'lucide-react';
import { QuizFilters, QuizSortOption } from '@/lib/types';

interface QuizFiltersProps {
  filters: QuizFilters;
  sortOption: QuizSortOption;
  onFiltersChange: (filters: QuizFilters) => void;
  onSortChange: (sort: QuizSortOption) => void;
  totalQuizzes: number;
  filteredCount: number;
}

export const QuizFiltersComponent: React.FC<QuizFiltersProps> = ({
  filters,
  sortOption,
  onFiltersChange,
  onSortChange,
  totalQuizzes,
  filteredCount
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
    <Card className="mb-6">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center">
            <Filter className="w-5 h-5 mr-2" />
            Filters & Sorting
          </CardTitle>
          <div className="text-sm text-muted-foreground">
            Showing {filteredCount} of {totalQuizzes} quizzes
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Quiz Type Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Quiz Type
            </label>
            <Select value={filters.type} onValueChange={handleTypeChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Types</SelectItem>
                <SelectItem value="MCQ">Multiple Choice</SelectItem>
                <SelectItem value="TRUE_FALSE">True/False</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Difficulty Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Difficulty
            </label>
            <Select value={filters.difficulty} onValueChange={handleDifficultyChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Levels</SelectItem>
                <SelectItem value="Easy">Easy</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sort Field */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Sort By
            </label>
            <Select value={sortOption.field} onValueChange={handleSortFieldChange}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lastAttempted">Last Attempted</SelectItem>
                <SelectItem value="createdAt">Created Date</SelectItem>
                <SelectItem value="lastScore">Last Score</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sort Direction & Clear */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Actions
            </label>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={toggleSortDirection}
                className="flex items-center space-x-1 flex-1"
              >
                {sortOption.direction === 'asc' ? (
                  <SortAsc className="w-4 h-4" />
                ) : (
                  <SortDesc className="w-4 h-4" />
                )}
                <span className="hidden sm:inline">
                  {sortOption.direction === 'asc' ? 'Asc' : 'Desc'}
                </span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                className="flex-1"
              >
                Clear
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
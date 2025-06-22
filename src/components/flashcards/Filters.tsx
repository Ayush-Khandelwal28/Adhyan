import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Filter, BookOpen, Brain, Lightbulb } from 'lucide-react';
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

  const getColor = (type: string) => {
    switch (type) {
      case 'definitions':
        return 'text-blue-600 dark:text-blue-400';
      case 'recall':
        return 'text-green-600 dark:text-green-400';
      case 'application':
        return 'text-purple-600 dark:text-purple-400';
      default:
        return 'text-gray-600';
    }
  };

  const cardTypes = [
    { id: 'definitions', label: 'Definitions', count: cardCounts.definitions },
    { id: 'recall', label: 'Recall Questions', count: cardCounts.recall },
    { id: 'application', label: 'Application-Based', count: cardCounts.application }
  ];

  return (
    <Card className="mb-6">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg flex items-center">
          <Filter className="w-5 h-5 mr-2" />
          Card Types
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {cardTypes.map(({ id, label, count }) => (
            <div key={id} className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <Checkbox
                id={id}
                checked={filters[id as keyof FilterState]}
                onCheckedChange={(checked) => handleFilterChange(id as keyof FilterState, checked as boolean)}
              />
              <Label
                htmlFor={id}
                className="flex items-center space-x-2 cursor-pointer flex-1"
              >
                <span className={getColor(id)}>
                  {getIcon(id)}
                </span>
                <span className="font-medium">{label}</span>
                <span className="text-sm text-muted-foreground">({count})</span>
              </Label>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
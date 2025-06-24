import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, HelpCircle, CheckCircle, BarChart3, Clock, Target, Zap } from 'lucide-react';
import { NewQuizRequest } from '@/lib/types';
import { cn } from '@/lib/utils';

interface NewQuizDialogProps {
  onCreateQuiz: (request: NewQuizRequest) => void;
  isCreating?: boolean;
}

export const NewQuizDialog: React.FC<NewQuizDialogProps> = ({
  onCreateQuiz,
  isCreating = false
}) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<NewQuizRequest>({
    type: 'MCQ',
    questionCount: 10,
    difficulty: 'Medium',
    title: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateQuiz(formData);
    setOpen(false);
    // Reset form
    setFormData({
      type: 'MCQ',
      questionCount: 10,
      difficulty: 'Medium',
      title: ''
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'MCQ':
        return <HelpCircle className="w-5 h-5" />;
      case 'TRUE_FALSE':
        return <CheckCircle className="w-5 h-5" />;
      case 'MIXED':
        return <BarChart3 className="w-5 h-5" />;
      default:
        return <HelpCircle className="w-5 h-5" />;
    }
  };

  const questionCounts = [5, 10, 15, 20] as const;
  const quizTypes = [
    { value: 'MCQ', label: 'Multiple Choice', description: 'Questions with 4 answer options' },
    { value: 'TRUE_FALSE', label: 'True/False', description: 'Simple true or false questions' }
  ] as const;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600">
          <Plus className="h-5 w-5 mr-2" />
          Generate New Quiz
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Generate New Quiz</DialogTitle>
          <DialogDescription>
            Create a customized quiz based on your study pack content. Choose the type, difficulty, and number of questions.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Quiz Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Quiz Title (Optional)</Label>
            <Input
              id="title"
              placeholder="Enter a custom title or leave blank for auto-generation"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          {/* Quiz Type Selection */}
          <div className="space-y-3">
            <Label>Quiz Type</Label>
            <div className="grid grid-cols-1 gap-3">
              {quizTypes.map((type) => (
                <Card
                  key={type.value}
                  className={cn(
                    "cursor-pointer transition-all duration-200 hover:shadow-md",
                    formData.type === type.value
                      ? "ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20"
                      : "hover:bg-gray-50 dark:hover:bg-gray-800"
                  )}
                  onClick={() => setFormData({ ...formData, type: type.value as any })}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className={cn(
                        "p-2 rounded-lg",
                        formData.type === type.value
                          ? "bg-blue-100 text-blue-600 dark:bg-blue-800 dark:text-blue-300"
                          : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                      )}>
                        {getTypeIcon(type.value)}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold">{type.label}</h4>
                        <p className="text-sm text-muted-foreground">{type.description}</p>
                      </div>
                      {formData.type === type.value && (
                        <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full" />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Question Count */}
          <div className="space-y-3">
            <Label>Number of Questions</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {questionCounts.map((count) => (
                <Card
                  key={count}
                  className={cn(
                    "cursor-pointer transition-all duration-200 hover:shadow-md",
                    formData.questionCount === count
                      ? "ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20"
                      : "hover:bg-gray-50 dark:hover:bg-gray-800"
                  )}
                  onClick={() => setFormData({ ...formData, questionCount: count })}
                >
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {count}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Difficulty Level */}
          <div className="space-y-2">
            <Label htmlFor="difficulty">Difficulty Level</Label>
            <Select 
              value={formData.difficulty} 
              onValueChange={(value) => setFormData({ ...formData, difficulty: value as any })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Easy">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span>Easy - Basic concepts</span>
                  </div>
                </SelectItem>
                <SelectItem value="Medium">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                    <span>Medium - Moderate challenge</span>
                  </div>
                </SelectItem>
                <SelectItem value="Hard">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full" />
                    <span>Hard - Advanced concepts</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Quiz Preview */}
          <Card className="bg-gray-50 dark:bg-gray-800/50">
            <CardContent className="p-4">
              <h4 className="font-semibold mb-3 flex items-center">
                <Target className="w-4 h-4 mr-2" />
                Quiz Preview
              </h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  {getTypeIcon(formData.type)}
                  <span>{quizTypes.find(t => t.value === formData.type)?.label}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Target className="w-4 h-4" />
                  <span>{formData.questionCount} questions</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Zap className="w-4 h-4" />
                  <span>{formData.difficulty} difficulty</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)}
              disabled={isCreating}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isCreating}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isCreating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Generating...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Generate Quiz
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
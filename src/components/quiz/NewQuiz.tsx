import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { NewQuizRequest } from '@/lib/types';
import { cn } from '@/lib/utils';

interface NewQuizDialogProps {
  onCreateQuiz: (request: NewQuizRequest) => Promise<void>;
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onCreateQuiz(formData);
      setOpen(false);
      setFormData({
        type: 'MCQ',
        questionCount: 10,
        difficulty: 'Medium',
        title: ''
      });
    } catch (error) {
      console.error('Error creating quiz:', error);
    }
  };

  const questionCounts = [5, 10, 15, 20] as const;
  const quizTypes = [
    { value: 'MCQ', label: 'Multiple Choice', description: 'Questions with 4 answer options' },
    { value: 'TRUE_FALSE', label: 'True/False', description: 'Simple true or false questions' }
  ] as const;

  return (
    <Dialog open={open} onOpenChange={(open) => !isCreating && setOpen(open)}>
      <DialogTrigger asChild>
        <Button size="lg" className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 cursor-pointer">
          Generate New Quiz
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle className="text-lg">Generate New Quiz</DialogTitle>
          <DialogDescription>
            Create a quiz based on your study pack content.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Quiz Title */}
          <div className="space-y-1.5">
            <Label htmlFor="title" className="text-sm font-medium">Quiz Title (Optional)</Label>
            <Input
              id="title"
              placeholder="Enter a custom title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              disabled={isCreating}
              className="h-9"
            />
          </div>

          {/* Quiz Type Selection */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Quiz Type</Label>
            <div className="space-y-2">
              {quizTypes.map((type) => (
                <div
                  key={type.value}
                  className={cn(
                    "flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-all",
                    formData.type === type.value
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                      : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800",
                    isCreating && "opacity-60 cursor-not-allowed"
                  )}
                  onClick={() => !isCreating && setFormData({ ...formData, type: type.value as any })}
                >
                  <div className={cn(
                    "w-4 h-4 rounded-full border-2 flex items-center justify-center",
                    formData.type === type.value
                      ? "border-blue-500 bg-blue-500"
                      : "border-gray-300 dark:border-gray-600"
                  )}>
                    {formData.type === type.value && (
                      <div className="w-2 h-2 bg-white rounded-full" />
                    )}
                  </div>
                  <div>
                    <div className="font-medium text-sm">{type.label}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{type.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Question Count and Difficulty */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Questions</Label>
              <Select 
                value={formData.questionCount.toString()} 
                onValueChange={(value) => setFormData({ ...formData, questionCount: parseInt(value) as 5 | 10 | 15 | 20 })}
                disabled={isCreating}
              >
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {questionCounts.map((count) => (
                    <SelectItem key={count} value={count.toString()}>
                      {count} questions
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Difficulty</Label>
              <Select
                value={formData.difficulty}
                onValueChange={(value) => setFormData({ ...formData, difficulty: value as any })}
                disabled={isCreating}
              >
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Easy">Easy</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isCreating}
              className="h-9"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isCreating}
              className="bg-blue-600 hover:bg-blue-700 h-9 cursor-pointert"
            >
              {isCreating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Generating...
                </>
              ) : (
                "Generate Quiz"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
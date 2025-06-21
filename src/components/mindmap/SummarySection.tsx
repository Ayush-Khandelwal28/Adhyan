import React from 'react';
import { Info, Lightbulb, X, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { StudyNotesStructure } from '@/lib/types';
import { Breakpoint } from '@/hooks/useBreakpoint';

interface SummarySectionProps {
  studyNotes: StudyNotesStructure;
  isVisible: boolean;
  onToggle: () => void;
  breakpoint: Breakpoint;
}

export const SummarySection: React.FC<SummarySectionProps> = ({
  studyNotes,
  isVisible,
  onToggle,
  breakpoint
}) => {
  const isMobile = breakpoint === 'sm';

  if (isMobile) {
    return (
      <div className="absolute bottom-4 right-4 z-10">
        <Button
          onClick={onToggle}
          size="lg"
          className="rounded-full shadow-lg"
          title="Toggle Summary"
        >
          <Info className="w-5 h-5" />
        </Button>

        {isVisible && (
          <Card className="absolute bottom-16 right-0 w-72 max-w-xs shadow-xl">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center">
                  <Info className="w-4 h-4 mr-2 text-blue-600" />
                  Summary
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onToggle}
                  className="h-8 w-8 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {studyNotes.summary}
              </p>

              {studyNotes.key_takeaways && studyNotes.key_takeaways.length > 0 && (
                <div>
                  <h4 className="font-semibold text-base mb-2 flex items-center">
                    <Lightbulb className="w-4 h-4 mr-2 text-orange-500" />
                    Key Takeaways
                  </h4>
                  <ul className="space-y-2 max-h-40 overflow-y-auto">
                    {studyNotes.key_takeaways.map((takeaway, index) => (
                      <li key={index} className="text-sm text-muted-foreground pl-3 border-l-2 border-indigo-200 dark:border-indigo-700 bg-indigo-50 dark:bg-indigo-900/20 p-2 rounded">
                        {takeaway}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  return (
    <div className={cn(
      "absolute top-4 z-10 transition-all duration-300",
      isVisible ? "right-4" : "-right-80"
    )}>
      <div className="flex items-start">
        <Button
          onClick={onToggle}
          variant="outline"
          className="rounded-l-lg rounded-r-none shadow-lg border-r-0 h-auto py-4 px-3 flex-col space-y-2"
          title={isVisible ? 'Hide Summary' : 'Show Summary'}
        >
          {isVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          <span className="text-xs whitespace-nowrap transform rotate-180 writing-mode-vertical" style={{ writingMode: 'vertical-rl' }}>
            Summary
          </span>
        </Button>

        <Card className={cn(
          "rounded-l-none shadow-lg transition-all duration-300",
          breakpoint === 'md' ? 'max-w-sm' : 'max-w-md'
        )}>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Info className="w-5 h-5 mr-2 text-blue-600" />
              Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              {studyNotes.summary}
            </p>

            {studyNotes.key_takeaways && studyNotes.key_takeaways.length > 0 && (
              <div>
                <h3 className="font-semibold text-lg mb-2 flex items-center">
                  <Lightbulb className="w-5 h-5 mr-2 text-orange-500" />
                  Key Takeaways
                </h3>
                <ul className="space-y-2 max-h-48 overflow-y-auto">
                  {studyNotes.key_takeaways.map((takeaway, index) => (
                    <li key={index} className="text-sm text-muted-foreground pl-4 border-l-2 border-indigo-200 dark:border-indigo-700 bg-indigo-50 dark:bg-indigo-900/20 p-2 rounded">
                      {takeaway}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
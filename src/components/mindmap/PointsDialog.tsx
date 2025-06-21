import React from 'react';
import { List, FileText, Lightbulb } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface PointsDialogProps {
  data: any;
  trigger: React.ReactNode;
}

export const PointsDialog: React.FC<PointsDialogProps> = ({ data, trigger }) => {
  const hasContent = data && (
    (data.points && data.points.length > 0) ||
    (data.definitions && data.definitions.length > 0) ||
    (data.examples && data.examples.length > 0)
  );

  if (!hasContent) return <>{trigger}</>;

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{data.heading || data.subheading}</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          {data.points && data.points.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center">
                <List className="w-4 h-4 mr-2" />
                Key Points
              </h4>
              <ul className="space-y-2">
                {data.points.map((point: string, index: number) => (
                  <li key={index} className="text-sm text-gray-700 dark:text-gray-300 pl-4 border-l-2 border-blue-200 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20 p-2 rounded">
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {data.definitions && data.definitions.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center">
                <FileText className="w-4 h-4 mr-2" />
                Definitions
              </h4>
              <ul className="space-y-2">
                {data.definitions.map((definition: string, index: number) => (
                  <li key={index} className="text-sm text-gray-700 dark:text-gray-300 pl-4 border-l-2 border-red-200 dark:border-red-700 bg-red-50 dark:bg-red-900/20 p-2 rounded">
                    {definition}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {data.examples && data.examples.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center">
                <Lightbulb className="w-4 h-4 mr-2" />
                Examples
              </h4>
              <ul className="space-y-2">
                {data.examples.map((example: string, index: number) => (
                  <li key={index} className="text-sm text-gray-700 dark:text-gray-300 pl-4 border-l-2 border-orange-200 dark:border-orange-700 bg-orange-50 dark:bg-orange-900/20 p-2 rounded">
                    {example}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
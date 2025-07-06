import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Type, Printer, ArrowUp } from 'lucide-react';

interface ReadingControlsProps {
  fontSize: number;
  onFontSizeChange: (size: number) => void;
  onScrollToTop: () => void;
}

export const ReadingControls: React.FC<ReadingControlsProps> = ({
  fontSize,
  onFontSizeChange,
  onScrollToTop
}) => {
  const handlePrint = () => {
    window.print();
  };

  const fontSizes = [
    { label: 'A-', value: 14 },
    { label: 'A', value: 16 },
    { label: 'A+', value: 18 }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <Type className="w-5 h-5 mr-2 text-gray-600 dark:text-gray-400" />
          Reading Controls
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Font Size Controls */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">
            Font Size
          </label>
          <div className="flex space-x-1">
            {fontSizes.map((size) => (
              <Button
                key={size.value}
                variant={fontSize === size.value ? "default" : "outline"}
                size="sm"
                onClick={() => onFontSizeChange(size.value)}
                className="flex-1"
              >
                {size.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Utility Buttons */}
        <div className="space-y-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrint}
            className="w-full justify-start"
          >
            <Printer className="w-4 h-4 mr-2" />
            Print Notes
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onScrollToTop}
            className="w-full justify-start"
          >
            <ArrowUp className="w-4 h-4 mr-2" />
            Scroll to Top
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

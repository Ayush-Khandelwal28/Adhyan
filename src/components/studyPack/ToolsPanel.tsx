import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, HelpCircle, BookOpen, Timer, Focus, Printer, Type, ArrowUp } from 'lucide-react';
import { StudyPackData } from '@/lib/types';

interface StudyToolsPanelProps {
  studyPack: StudyPackData;
  fontSize: number;
  onFontSizeChange: (size: number) => void;
  onScrollToTop: () => void;
}

export const StudyToolsPanel: React.FC<StudyToolsPanelProps> = ({
  studyPack,
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
    <div className="space-y-6">
      {/* Study Tools */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
        <Brain className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
        Study Tools
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
        <Link href="/mindmap" className="block">
          <Button className="w-full h-16 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white">
            <div className="flex flex-col items-center space-y-1">
          <Brain className="w-6 h-6" />
          <span className="font-semibold">Mind Map</span>
            </div>
          </Button>
        </Link>

        <Link href="/quiz" className="block">
          <Button className="w-full h-16 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white">
            <div className="flex flex-col items-center space-y-1">
          <HelpCircle className="w-6 h-6" />
          <div className="flex items-center space-x-2">
            <span className="font-semibold">Quiz</span>
          </div>
            </div>
          </Button>
        </Link>

        <Link href="/flashcard" className="block">
          <Button className="w-full h-16 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white">
            <div className="flex flex-col items-center space-y-1">
          <BookOpen className="w-6 h-6" />
          <div className="flex items-center space-x-2">
            <span className="font-semibold">Flashcards</span>
          </div>
            </div>
          </Button>
        </Link>
          </div>
        </CardContent>
      </Card>

      {/* Reading Controls */}
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
    </div>
  );
};
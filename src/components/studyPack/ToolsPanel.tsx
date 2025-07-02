import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, HelpCircle, Map, Printer, Type, ArrowUp } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface StudyToolsPanelProps {
  studyPackId: string;
  fontSize: number;
  onFontSizeChange: (size: number) => void;
  onScrollToTop: () => void;
}

export const StudyToolsPanel: React.FC<StudyToolsPanelProps> = ({
  studyPackId,
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

  const router = useRouter();

  const handleToolClick = (tool: string) => {
    switch (tool) {
      case 'mindMap':
        router.push(`/studypack/${studyPackId}/mindmap`);
        break;
      case 'quiz':
        router.push(`/studypack/${studyPackId}/quiz`);
        break;
      case 'flashcards':
        router.push(`/studypack/${studyPackId}/flashcards`);
        break;
      default:
        break;
    }
  }

  const tools = [
    {
      tool: 'mindMap',
      label: 'Mind Map',
      icon: Map,
      gradient: 'from-blue-500 to-blue-600'
    },
    {
      tool: 'quiz',
      label: 'Quiz',
      icon: HelpCircle,
      gradient: 'from-green-500 to-green-600'
    },
    {
      tool: 'flashcards',
      label: 'Flashcards',
      icon: Brain,
      gradient: 'from-purple-500 to-purple-600'
    }
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
            {tools.map(({ tool, label, icon: Icon, gradient }) => (
              <Button 
              key={tool}
              className={`w-full h-16 bg-gradient-to-r ${gradient} text-white cursor-pointer`}
              onClick={() => handleToolClick(tool)}
              >
              <div className="flex flex-col items-center space-y-1">
                <Icon className="w-6 h-6" />
                <span className="font-semibold">{label}</span>
              </div>
              </Button>
            ))}
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
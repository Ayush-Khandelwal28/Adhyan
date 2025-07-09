import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, HelpCircle, Map } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useStudyPack } from '@/contexts/StudyPackContext';

export const StudyTools: React.FC = () => {
  const router = useRouter();
  const { studyPackId } = useStudyPack();

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
  };

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
  );
};

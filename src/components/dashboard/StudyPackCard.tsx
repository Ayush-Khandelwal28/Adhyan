import { Calendar, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StudyPack } from '@/lib/types';
import { formatDate, formatLastAccessed } from '@/lib/utils';
import { CONTENT_TYPES, STUDY_PACK_ACTIONS } from '@/lib/constants';
import { ContentTypeIcon } from '@/components/ContentTypeIcon';
import { isValidContentType } from '@/lib/utils';
import { useRouter } from 'next/navigation';

export function StudyPackCard({ pack }: { pack: StudyPack }) {
    const router = useRouter();
    const type = isValidContentType(pack.type) ? pack.type : 'TEXT';
    const contentType = CONTENT_TYPES[type];

    const handleClick = () => {
        router.push(`/studypack/${pack.id}`);
    };

    const handleActionClick = (actionLabel: string, event: React.MouseEvent) => {
        event.stopPropagation(); // Prevent card click
        const routes: Record<string, string> = {
            'Notes': `/studypack/${pack.id}`,
            'Mind Map': `/studypack/${pack.id}/mindmap`,
            'Flashcards': `/studypack/${pack.id}/flashcards`,
            'Quiz': `/studypack/${pack.id}/quiz`
        };
        
        const route = routes[actionLabel];
        if (route) {
            router.push(route);
        }
    };

    return (
        <Card className={`hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm group flex flex-col h-full}`} onClick={handleClick}>
            <CardHeader className="flex-grow">
                <div className="flex items-start justify-between mb-2">
                    <Badge
                        variant="secondary"
                        className={`${contentType.color} flex items-center gap-1`}
                    >
                        <ContentTypeIcon type={type} />
                        <span>{contentType.label}</span>
                    </Badge>
                    <div className="text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3 inline mr-1" />
                        {formatDate(pack.createdAt)}
                    </div>
                </div>
                <CardTitle className="text-lg font-bold line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {pack.title}
                </CardTitle>
                {pack.lastAccessed && (
                    <p className="flex items-center text-sm text-muted-foreground">
                        <Clock className="h-3 w-3 mr-1" />
                        Last accessed {formatLastAccessed(pack.lastAccessed)}
                    </p>
                )}
            </CardHeader>

            <CardContent className="mt-auto pt-0">
                <div className="grid grid-cols-2 gap-2">
                    {STUDY_PACK_ACTIONS.map((action) => (
                        <Button
                            key={action.label}
                            variant="outline"
                            size="sm"
                            className="w-full flex items-center justify-center space-x-1 cursor-pointer"
                            onClick={(e) => handleActionClick(action.label, e)}
                        >
                            <action.icon className="h-4 w-4" />
                            <span>{action.label}</span>
                        </Button>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
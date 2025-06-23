'use client';

import { Clock, FileText, Youtube, Type } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { StudyPack } from '@/lib/types';
import { formatLastAccessed, getTypeColor } from '@/lib/utils';
import { CONTENT_TYPES } from '@/lib/constants';
import { ContentTypeIcon } from '../ContentTypeIcon';
import { isValidContentType } from '@/lib/utils';
import { useRouter } from 'next/navigation';

export function RecentlyAccessed({ recentlyAccessed }: { recentlyAccessed: StudyPack[] }) {

  const router = useRouter();
  const openStudyPack = (id: string) => {
    router.push(`/studypack/${id}`);
  };

  return (
    <div className="mb-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
          <Clock className="h-6 w-6 mr-2 text-blue-600 dark:text-blue-400" />
          Recently Accessed
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {recentlyAccessed.map((pack) => {
            const type = isValidContentType(pack.type) ? pack.type : 'TEXT';
            const contentType = CONTENT_TYPES[type];

            return (
              <Card key={pack.id} className="hover:shadow-lg transition-all duration-200 hover:scale-105 cursor-pointer bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm" onClick={() => openStudyPack(pack.id)}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <Badge
                      variant="secondary"
                      className={`${contentType.color} flex items-center gap-1`}
                    >
                      <ContentTypeIcon type={type} />
                      <span>{contentType.label}</span>
                    </Badge>
                  </div>
                  <CardTitle className="text-sm font-semibold line-clamp-2">{pack.title}</CardTitle>
                </CardHeader>
                <CardContent className="mt-auto pt-0">
                  <p className="text-xs text-muted-foreground">
                    {formatLastAccessed(pack.lastAccessed)}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
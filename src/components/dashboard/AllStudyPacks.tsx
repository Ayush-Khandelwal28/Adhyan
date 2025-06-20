'use client';

import { BookOpen } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { StudyPack } from '@/lib/types';
import { StudyPackCard } from './StudyPackCard';

export function AllStudyPacks({ studyPacks }: { studyPacks: StudyPack[] }) {

    return (
        <div>
            <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                    <BookOpen className="h-6 w-6 mr-2 text-blue-600 dark:text-blue-400" />
                    All Study Packs
                </h2>

                {studyPacks.length === 0 ? (
                    <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm group">
                        <CardContent className="text-center py-12">
                            <BookOpen className="h-16 w-16 mx-auto mb-4 text-blue-600 dark:text-blue-400" />
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                No Study Packs Yet
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 mb-6">
                                Upload your first piece of content to get started with AI-powered studying.
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {studyPacks.map((pack) => (
                            <StudyPackCard key={pack.id} pack={pack} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
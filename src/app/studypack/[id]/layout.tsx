'use client';

import React, { use } from 'react';
import { usePathname } from 'next/navigation';
import { StudyPackBreadcrumb } from '@/components/studyPack/Breadcrumb';
import { ThemeToggle } from '@/components/theme-toggle';
import { StudyPackProvider, useStudyPack } from '@/contexts/StudyPackContext';

interface StudyPackLayoutProps {
    children: React.ReactNode;
    params: Promise<{ id: string }>;
}

const StudyPackLayoutContent: React.FC<{ children: React.ReactNode; studyPackId: string }> = ({ children, studyPackId }) => {
    const { studyPack, isLoading } = useStudyPack();
    const pathname = usePathname();

    const getCurrentPage = () => {
        if (pathname.includes('/quiz')) {
            const quizMatch = pathname.match(/\/quiz\/([^\/]+)$/);
            if (quizMatch) {
                return { current: 'Quiz', parent: 'Quizzes' };
            }
            return { current: 'Quizzes', parent: undefined };
        }
        if (pathname.includes('/flashcards')) return { current: 'Flashcards', parent: undefined };
        if (pathname.includes('/mindmap')) return { current: 'Mind Map', parent: undefined };
        return { current: undefined, parent: undefined }; // For the main studypack page
    };

    const pageInfo = getCurrentPage();

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex flex-col">
            <div className="p-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 flex items-center min-h-[80px]">
                <div className="flex flex-wrap sm:flex-nowrap justify-between items-center w-full gap-4">
                    <div className="w-full sm:w-auto flex-1 min-w-0">
                        <StudyPackBreadcrumb
                            studyPackId={studyPackId}
                            studyPackTitle={studyPack?.title || ''}
                            currentPage={pageInfo.current}
                            parentPage={pageInfo.parent}
                            isLoading={isLoading}
                        />
                    </div>
                    <div className="flex-shrink-0 self-start sm:self-center">
                        <ThemeToggle />
                    </div>
                </div>
            </div>
            <div className="flex-1 w-full max-w-[100vw] overflow-x-hidden">
                {children}
            </div>
        </div>
    );
};

export default function StudyPackLayout({ children, params }: StudyPackLayoutProps) {
    const { id } = use(params);

    return (
        <StudyPackProvider studyPackId={id}>
            <StudyPackLayoutContent studyPackId={id}>
                {children}
            </StudyPackLayoutContent>
        </StudyPackProvider>
    );
}

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
        if (pathname.includes('/quiz')) return 'Quizzes';
        if (pathname.includes('/flashcards')) return 'Flashcards';
        if (pathname.includes('/mindmap')) return 'Mind Map';
        return undefined; // For the main studypack page
    };

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
            <div className="h-[120px] p-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 flex items-center">
                <div className="flex justify-between items-center w-full">
                    <StudyPackBreadcrumb
                        studyPackId={studyPackId}
                        studyPackTitle={studyPack?.title || ''}
                        currentPage={getCurrentPage()}
                        isLoading={isLoading}
                    />
                    <ThemeToggle />
                </div>
            </div>
            <div className="min-h-[calc(100vh-120px)]">
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

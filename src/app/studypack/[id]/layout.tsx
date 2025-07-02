'use client';

import React, { useState, useEffect, use } from 'react';
import { usePathname } from 'next/navigation';
import { StudyPackBreadcrumb } from '@/components/studyPack/Breadcrumb';
import { StudyPackData } from '@/lib/types';
import { ThemeToggle } from '@/components/theme-toggle';

interface StudyPackLayoutProps {
    children: React.ReactNode;
    params: Promise<{ id: string }>;
}

export default function StudyPackLayout({ children, params }: StudyPackLayoutProps) {
    const [studyPack, setStudyPack] = useState<StudyPackData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const { id } = use(params);
    const pathname = usePathname();

    const getCurrentPage = () => {
        if (pathname.includes('/quiz')) return 'Quizzes';
        if (pathname.includes('/flashcards')) return 'Flashcards';
        if (pathname.includes('/mindmap')) return 'Mind Map';
        return undefined; // For the main studypack page
    };

    const fetchStudyPack = async (studyPackId: string) => {
        try {
            setIsLoading(true);
            const response = await fetch(`/api/studypacks/${studyPackId}`);
            if (response.ok) {
                const data = await response.json();
                setStudyPack(data.studyPack as StudyPackData);
            } else {
                console.error('Failed to fetch study pack');
            }
        } catch (error) {
            console.error('Error fetching study pack:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (id) fetchStudyPack(id);
    }, [id]);

    if (isLoading) {
        return (
            <div className="min-h-screen">
                <div className="p-4">
                    <div className="animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-64 mb-4"></div>
                        <div className="h-8 bg-gray-200 rounded w-32 mb-6"></div>
                    </div>
                </div>
                {children}
            </div>
        );
    }

    if (!studyPack) {
        return (
            <div className="min-h-screen">
                <div className="p-4">
                    <div className="text-center text-muted-foreground">
                        Study pack not found
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
            <div className="p-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center">
                    <StudyPackBreadcrumb
                        studyPackId={id}
                        studyPackTitle={studyPack.title}
                        currentPage={getCurrentPage()}
                    />
                    <ThemeToggle />
                </div>
            </div>
            <div className="min-h-[calc(100vh-120px)]">
                {children}
            </div>
        </div>
    );
}

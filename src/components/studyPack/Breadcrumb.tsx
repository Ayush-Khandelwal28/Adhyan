import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Brain, BookOpen, Zap, Map } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BreadcrumbProps {
    studyPackId: string;
    studyPackTitle: string;
    currentPage?: string;
    action?: React.ReactNode;
}

const getPageIcon = (page?: string) => {
    switch (page) {
        case 'Quizzes':
            return <Brain className="w-5 h-5" />;
        case 'Flashcards':
            return <Zap className="w-5 h-5" />;
        case 'Mind Map':
            return <Map className="w-5 h-5" />;
        default:
            return <BookOpen className="w-5 h-5" />;
    }
};

export const StudyPackBreadcrumb: React.FC<BreadcrumbProps> = ({
    studyPackId,
    studyPackTitle,
    currentPage
}) => {
    return (
        <div className="space-y-6 pb-2">
            <nav className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                <Link
                    href="/dashboard"
                    className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
                >
                    Dashboard
                </Link>
                <span className="text-gray-300 dark:text-gray-600">/</span>
                <Link
                    href={`/studypack/${studyPackId}`}
                    className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
                >
                    {studyPackTitle}
                </Link>
                {currentPage && (
                    <>
                        <span className="text-gray-300 dark:text-gray-600">/</span>
                        <span className="text-gray-700 dark:text-gray-300 font-semibold">{currentPage}</span>
                    </>
                )}
            </nav>

            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    {/* Back Button */}
                    {currentPage ? (
                        <Link href={`/studypack/${studyPackId}`}>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800"
                            >
                                <ArrowLeft className="w-4 h-4" />
                            </Button>
                        </Link>
                    ) : (
                        <Link href="/dashboard">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800"
                            >
                                <ArrowLeft className="w-4 h-4" />
                            </Button>
                        </Link>
                    )}

                    <div className="flex items-center space-x-4">
                        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                            {getPageIcon(currentPage)}
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
                                {currentPage || studyPackTitle}
                            </h1>
                            {currentPage && (
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    {studyPackTitle}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

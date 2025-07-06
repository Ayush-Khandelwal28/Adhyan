import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Brain, BookOpen, Zap, Map } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BreadcrumbProps {
    studyPackId: string;
    studyPackTitle: string;
    currentPage?: string;
    parentPage?: string; // Added to handle nested navigation
    action?: React.ReactNode;
    isLoading?: boolean;
}

const getPageIcon = (page?: string) => {
    switch (page) {
        case 'Quiz':
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
    currentPage,
    parentPage,
    isLoading = false
}) => {
    const router = useRouter();

    return (
        <div className="space-y-4 pb-2">
            <nav className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 min-h-[20px]">
                <button
                    onClick={() => router.push("/dashboard")}
                    className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium cursor-pointer"
                >
                    Dashboard
                </button>
                <span className="text-gray-300 dark:text-gray-600">/</span>
                {isLoading ? (
                    <div className="w-24 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                ) : (
                    <button
                        onClick={() => router.push(`/studypack/${studyPackId}`)}
                        className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium cursor-pointer"
                    >
                        {studyPackTitle}
                    </button>
                )}
                <div className="flex items-center min-w-0">
                    {parentPage && (
                        <>
                            <span className="text-gray-300 dark:text-gray-600 mx-2">/</span>
                            <button
                                onClick={() => {
                                    const parentRoutes: Record<string, string> = {
                                        'Quizzes': `/studypack/${studyPackId}/quiz`,
                                        'Flashcards': `/studypack/${studyPackId}/flashcards`,
                                        'Mind Map': `/studypack/${studyPackId}/mindmap`
                                    };
                                    const route = parentRoutes[parentPage];
                                    if (route) {
                                        router.push(route);
                                    }
                                }}
                                className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium cursor-pointer"
                            >
                                {parentPage}
                            </button>
                        </>
                    )}
                    {currentPage && (
                        <>
                            <span className="text-gray-300 dark:text-gray-600 mx-2">/</span>
                            <span className="text-gray-700 dark:text-gray-300 font-semibold">{currentPage}</span>
                        </>
                    )}
                </div>
            </nav>

            <div className="flex items-center justify-between min-h-[48px]">
                <div className="flex items-center space-x-4">
                    {/* Back Button */}
                    {currentPage ? (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                                if (parentPage) {
                                    // Navigate to parent page
                                    const parentRoutes: Record<string, string> = {
                                        'Quizzes': `/studypack/${studyPackId}/quiz`,
                                        'Flashcards': `/studypack/${studyPackId}/flashcards`,
                                        'Mind Map': `/studypack/${studyPackId}/mindmap`
                                    };
                                    const route = parentRoutes[parentPage];
                                    if (route) {
                                        router.push(route);
                                    } else {
                                        router.push(`/studypack/${studyPackId}`);
                                    }
                                } else {
                                    // Navigate to main study pack page
                                    router.push(`/studypack/${studyPackId}`);
                                }
                            }}
                            className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                        >
                            <ArrowLeft className="w-4 h-4" />
                        </Button>
                    ) : (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.push("/dashboard")}
                            className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                        >
                            <ArrowLeft className="w-4 h-4" />
                        </Button>
                    )}

                    <div className="flex items-center space-x-4">
                        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                            {getPageIcon(currentPage)}
                        </div>
                        <div className="min-h-[32px] flex flex-col justify-center">
                            {isLoading ? (
                                <div className="space-y-2">
                                    <div className="w-48 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                                    <div className="w-32 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                                </div>
                            ) : (
                                <>
                                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
                                        {currentPage || studyPackTitle}
                                    </h1>
                                    {currentPage && (
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                            {studyPackTitle}
                                        </p>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

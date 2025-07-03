import { Card, CardHeader, CardContent } from '@/components/ui/card';

export function QuizLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-6 py-8">
        <div className="space-y-8">
          {/* Quiz Header Skeleton */}
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
          </div>

          <Card className="animate-pulse">
            <CardHeader>
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Answer options skeleton */}
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-between items-center animate-pulse">
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
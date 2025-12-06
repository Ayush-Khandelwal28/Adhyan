'use client';

import { Brain, LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';

export function DashboardHeader() {
  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
  };

  return (
    <header className="flex w-full items-center justify-between mb-8">
      <div className="flex items-center space-x-2 md:space-x-3">
        <Brain className="h-6 w-6 md:h-8 md:w-8 text-blue-600 dark:text-blue-400" />
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Adhyan</h1>
      </div>

      <div className="flex items-center space-x-4">
        <ThemeToggle />
        <Button
          variant="outline"
          size="sm"
          onClick={handleSignOut}
          className="flex items-center space-x-2"
        >
          <LogOut className="h-4 w-4" />
          <span>Sign Out</span>
        </Button>
      </div>
    </header>
  );
}

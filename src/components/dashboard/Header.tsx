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
    <header className="flex items-center justify-between mb-8">
      <div className="flex items-center space-x-3">
        <Brain className="h-8 w-8 text-blue-600 dark:text-blue-400" />
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
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

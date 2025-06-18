import Link from 'next/link';
import { ThemeToggle } from '@/components/theme-toggle';

export function DesktopNav() {
  return (
    <div className="hidden md:flex items-center space-x-8">
      <Link href="#features" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
        Features
      </Link>
      <Link href="#how-it-works" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
        How it Works
      </Link>
      <ThemeToggle />
      <Link 
        href="/auth/signin" 
        className="bg-blue-600 dark:bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
      >
        Sign In
      </Link>
    </div>
  );
}
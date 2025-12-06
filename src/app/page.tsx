'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Navigation } from '@/components/landing/NavBar';
import { HeroSection } from '@/components/landing/HeroSection';
import { FeatureIcons } from '@/components/landing/Features';
import { DetailedFeatures } from '@/components/landing/DetailedFeatures';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { Footer } from '@/components/landing/Footer';

export default function Home() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') {
      router.replace('/dashboard');
    }
  }, [status, router]);

  // Show loading or nothing while checking session / redirecting
  if (status === 'loading' || status === 'authenticated') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Navigation />

      <main className="relative">
        {/* Hero Section */}
        <section className="relative">
          <div className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-16 text-center">
            <HeroSection />
            <FeatureIcons />
          </div>

          {/* Background Decoration */}
          <div className="absolute inset-0 z-0 overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-200/30 dark:bg-blue-500/20 rounded-full blur-3xl"></div>
            <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-indigo-200/30 dark:bg-indigo-500/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-purple-200/30 dark:bg-purple-500/20 rounded-full blur-3xl"></div>
          </div>
        </section>

        <DetailedFeatures />

        <HowItWorks />
      </main>

      <Footer />
    </div>
  );
}
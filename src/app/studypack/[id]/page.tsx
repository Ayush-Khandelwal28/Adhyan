'use client';

import React, { useState, useEffect, useRef } from 'react';

import { TableOfContents } from '@/components/studyPack/TableOfContents';
import { NotesContent } from '@/components/studyPack/Notes';
import { StudyTools } from '@/components/studyPack/StudyTools';
import { ReadingControls } from '@/components/studyPack/ReadingControls';
import { useStudyPack } from '@/contexts/StudyPackContext';

import { StudyNotesStructure } from '@/lib/types';

export default function StudyPackPage() {
  const { studyPack, isLoading } = useStudyPack();
  const [studyNotes, setStudyNotes] = useState<StudyNotesStructure | undefined>(undefined);
  const [activeSection, setActiveSection] = useState('section-0');
  const [fontSize, setFontSize] = useState(16);
  const [isMobile, setIsMobile] = useState(false);

  const contentRef = useRef<HTMLDivElement>(null);

  // Handle section navigation from TOC
  const handleSectionClick = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Scroll to top
  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Extract study notes when studyPack changes
  useEffect(() => {
    if (studyPack?.notesJson) {
      setStudyNotes(studyPack.notesJson);
    }
  }, [studyPack]);

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Return loading state while fetching study pack
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600 dark:text-gray-300">Fetching study pack...</p>
        </div>
      </div>
    );
  }

  if (!studyPack) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-gray-600 dark:text-gray-300">Study pack not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-6 py-8">
        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Panel - Notes Section (Desktop: 70%, Mobile: Full width) */}

          <div className="lg:col-span-8 space-y-6">
            {/* Table of Contents (Mobile) */}
            {isMobile && studyNotes && (
              <TableOfContents
                studyNotes={studyNotes}
                activeSection={activeSection}
                onSectionClick={handleSectionClick}
                isMobile={true}
              />
            )}

            {/* Notes Content */}
            <div
              ref={contentRef}
              style={{ fontSize: `${fontSize}px` }}
              className="prose prose-lg max-w-none dark:prose-invert"
            >
              {studyNotes && (
                <NotesContent
                  studyNotes={studyNotes}
                  onSectionInView={setActiveSection}
                />
              )}
            </div>
          </div>

          {/* Right Panel - Study Tools (Desktop: 30%, Mobile: Top) */}
          <div className="lg:col-span-4 order-first lg:order-last">
            {/* Study Tools - Normal scroll */}
            <div className="mb-6">
              <StudyTools />
            </div>

            {/* Sticky Container for TOC and Reading Controls (Desktop) */}
            {!isMobile && studyNotes && (
              <div className="sticky top-6 z-10 space-y-4">
                <TableOfContents
                  studyNotes={studyNotes}
                  activeSection={activeSection}
                  onSectionClick={handleSectionClick}
                  isMobile={false}
                />
                <ReadingControls
                  fontSize={fontSize}
                  onFontSizeChange={setFontSize}
                  onScrollToTop={handleScrollToTop}
                />
              </div>
            )}

            {/* Reading Controls for Mobile - when TOC is not shown */}
            {isMobile && (
              <div className="sticky top-6 z-10">
                <ReadingControls
                  fontSize={fontSize}
                  onFontSizeChange={setFontSize}
                  onScrollToTop={handleScrollToTop}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
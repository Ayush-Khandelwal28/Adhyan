'use client';

import React, { useState, useEffect, useRef } from 'react';

// Components
import { StudyPackHeader } from '@/components/studyPack/Header';
import { TableOfContents } from '@/components/studyPack/TableOfContents';
import { NotesContent } from '@/components/studyPack/Notes';
import { StudyToolsPanel } from '@/components/studyPack/ToolsPanel';

// Types and Data
import { StudyPackData, SearchResult } from '@/lib/types';
import studyPackData from '@/lib/mockdata/ml1.json';

const sampleStudyPack: StudyPackData = studyPackData.data as StudyPackData;

export default function StudyPackPage() {
  const [activeSection, setActiveSection] = useState('section-0');
  const [fontSize, setFontSize] = useState(16);
  const [isMobile, setIsMobile] = useState(false);

  const contentRef = useRef<HTMLDivElement>(null);

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-6 py-8">
        {/* Study Pack Header */}
        <StudyPackHeader studyPack={sampleStudyPack} />

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Panel - Notes Section (Desktop: 70%, Mobile: Full width) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Table of Contents (Mobile) */}
            {isMobile && (
              <TableOfContents
                studyPack={sampleStudyPack}
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
              <NotesContent
                studyPack={sampleStudyPack}
                onSectionInView={setActiveSection}
              />
            </div>
          </div>

          {/* Right Panel - Study Tools (Desktop: 30%, Mobile: Top) */}
          <div className="lg:col-span-4 order-first lg:order-last">
            <div className="space-y-6">
              {/* Table of Contents (Desktop) */}
              {!isMobile && (
                <TableOfContents
                  studyPack={sampleStudyPack}
                  activeSection={activeSection}
                  onSectionClick={handleSectionClick}
                  isMobile={false}
                />
              )}

              {/* Study Tools Panel */}
              <div className="sticky top-24">
                <StudyToolsPanel
                  studyPack={sampleStudyPack}
                  fontSize={fontSize}
                  onFontSizeChange={setFontSize}
                  onScrollToTop={handleScrollToTop}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
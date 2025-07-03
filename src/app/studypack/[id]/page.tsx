'use client';

import React, { useState, useEffect, useRef, use } from 'react';

import { TableOfContents } from '@/components/studyPack/TableOfContents';
import { NotesContent } from '@/components/studyPack/Notes';
import { StudyToolsPanel } from '@/components/studyPack/ToolsPanel';

import { StudyNotesStructure, StudyPackData } from '@/lib/types';

export default function StudyPackPage({ params }: { params: Promise<{ id: string }> }) {

  const [studyPack, setStudyPack] = useState<StudyPackData | undefined>(undefined);
  const [studyNotes, setStudyNotes] = useState<StudyNotesStructure | undefined>(undefined);
  const [activeSection, setActiveSection] = useState('section-0');
  const [fontSize, setFontSize] = useState(16);
  const [isMobile, setIsMobile] = useState(false);

  const { id } = use(params);
  const contentRef = useRef<HTMLDivElement>(null);

  const getStudyPackById = async (id: string) => {
    try {
      const response = await fetch(`/api/studypacks/${id}`);
      if (response.ok) {
        const data = await response.json();
        console.log('Fetched study pack:', data);
        setStudyNotes(data.studyPack.notesJson as StudyNotesStructure);
        setStudyPack(data.studyPack as StudyPackData);
      }
    } catch (error) {
      console.error(`Failed to fetch study pack with ID ${id}:`, error);
    }
  }

  // Check if mobile on mount and resize
  useEffect(() => {
    if (!id) return;
    
    const fetchData = async () => {
      await getStudyPackById(id);
    };

    fetchData();
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [id]);

  if (!id) {
    console.error('Study Pack ID not found in URL');
    return <div>Error: Study Pack ID not found</div>;
  }

  console.log('Study Notes ', studyNotes);
  console.log('Study Pack', studyPack);

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

  // Return loading state while fetching study pack
  if (!studyPack) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600 dark:text-gray-300">Fetching study pack...</p>
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
            <div className="space-y-6">
              {/* Study Tools Panel */}
              <div className=" top-24">
                <StudyToolsPanel
                  studyPackId={id}
                  fontSize={fontSize}
                  onFontSizeChange={setFontSize}
                  onScrollToTop={handleScrollToTop}
                />
              </div>
              {/* Table of Contents (Desktop) */}
              {!isMobile && studyNotes && (
                <div className="sticky top-48">
                  <TableOfContents
                    studyNotes={studyNotes}
                    activeSection={activeSection}
                    onSectionClick={handleSectionClick}
                    isMobile={false}
                  />
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
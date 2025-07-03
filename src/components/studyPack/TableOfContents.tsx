import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronDown, ChevronRight, List, Menu, X } from 'lucide-react';
import { StudyNotesStructure, TableOfContentsItem } from '@/lib/types';
import { cn } from '@/lib/utils';

interface TableOfContentsProps {
  studyNotes: StudyNotesStructure;
  activeSection: string;
  onSectionClick: (sectionId: string) => void;
  isMobile?: boolean;
}

export const TableOfContents: React.FC<TableOfContentsProps> = ({
  studyNotes,
  activeSection,
  onSectionClick,
  isMobile = false
}) => {
  const [isOpen, setIsOpen] = useState(!isMobile);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  // Generate table of contents structure
  const generateTOC = (): TableOfContentsItem[] => {
    const toc: TableOfContentsItem[] = [];

    studyNotes.sections.forEach((section, sectionIndex) => {
      const sectionId = `section-${sectionIndex}`;
      const tocItem: TableOfContentsItem = {
        id: sectionId,
        title: section.heading,
        level: 1,
        children: []
      };

      // Add subsections
      if (section.subsections) {
        section.subsections.forEach((subsection, subsectionIndex) => {
          const subsectionId = `subsection-${sectionIndex}-${subsectionIndex}`;
          tocItem.children!.push({
            id: subsectionId,
            title: subsection.subheading,
            level: 2
          });
        });
      }

      toc.push(tocItem);
    });

    // Add key takeaways and summary
    if (studyNotes.key_takeaways && studyNotes.key_takeaways.length > 0) {
      toc.push({
        id: 'key-takeaways',
        title: 'Key Takeaways',
        level: 1
      });
    }

    toc.push({
      id: 'summary',
      title: 'Summary',
      level: 1
    });

    return toc;
  };

  const tocItems = generateTOC();

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  };

  const handleSectionClick = (sectionId: string) => {
    onSectionClick(sectionId);
    if (isMobile) {
      setIsOpen(false);
    }
  };

  const renderTOCItem = (item: TableOfContentsItem) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedSections.has(item.id);
    const isActive = activeSection === item.id;

    return (
      <div key={item.id}>
        <div
          className={cn(
            "flex items-center space-x-2 py-2 px-3 rounded-lg cursor-pointer transition-colors",
            isActive
              ? "bg-blue-100 text-blue-900 dark:bg-blue-900/30 dark:text-blue-100"
              : "hover:bg-gray-100 dark:hover:bg-gray-800",
            item.level === 2 && "ml-4 text-sm"
          )}
          onClick={() => handleSectionClick(item.id)}
        >
          {hasChildren && (
            <Button
              variant="ghost"
              size="sm"
              className="h-4 w-4 p-0"
              onClick={(e) => {
                e.stopPropagation();
                toggleSection(item.id);
              }}
            >
              {isExpanded ? (
                <ChevronDown className="w-3 h-3" />
              ) : (
                <ChevronRight className="w-3 h-3" />
              )}
            </Button>
          )}
          {!hasChildren && <div className="w-4" />}
          <span className={cn(
            "flex-1 truncate",
            item.level === 1 ? "font-medium" : "font-normal"
          )}>
            {item.title}
          </span>
        </div>

        {hasChildren && isExpanded && (
          <div className="ml-2">
            {item.children!.map(child => renderTOCItem(child))}
          </div>
        )}
      </div>
    );
  };

  if (isMobile) {
    return (
      <>
        {/* Mobile TOC Toggle Button */}
        <Button
          onClick={() => setIsOpen(!isOpen)}
          variant="outline"
          size="sm"
          className="fixed top-4 left-4 z-50 lg:hidden"
        >
          {isOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </Button>

        {/* Mobile TOC Overlay */}
        {isOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <div className="absolute inset-0 bg-black/50" onClick={() => setIsOpen(false)} />
            <Card className="absolute top-16 left-4 right-4 max-h-[80vh] overflow-hidden">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <List className="w-5 h-5 mr-2" />
                  Table of Contents
                </CardTitle>
              </CardHeader>
              <CardContent className="overflow-y-auto max-h-[60vh]">
                <div className="space-y-1">
                  {tocItems.map(item => renderTOCItem(item))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </>
    );
  }

  return (
    <Card className="top-4 h-fit">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center">
          <List className="w-5 h-5 mr-2" />
          Table of Contents
        </CardTitle>
      </CardHeader>
      <CardContent className="max-h-[70vh] overflow-y-auto">
        <div className="space-y-1">
          {tocItems.map(item => renderTOCItem(item))}
        </div>
      </CardContent>
    </Card>
  );
};
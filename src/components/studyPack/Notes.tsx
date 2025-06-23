import React, { useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, FileText, Lightbulb, Link, Star } from 'lucide-react';
import { StudyPackData, SearchResult } from '@/lib/types';
import { cn } from '@/lib/utils';

interface NotesContentProps {
  studyPack: StudyPackData;
  onSectionInView: (sectionId: string) => void;
}

export const NotesContent: React.FC<NotesContentProps> = ({
  studyPack,
  onSectionInView
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<{ [key: string]: HTMLElement }>({});

  // Intersection Observer for active section tracking
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            onSectionInView(entry.target.id);
          }
        });
      },
      { threshold: 0.3, rootMargin: '-100px 0px -50% 0px' }
    );

    Object.values(sectionRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [onSectionInView]);



  const renderContentItem = (content: string, type: string) => {

    switch (type) {
      case 'definition':
        return (
          <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
            <CardContent className="p-4">
              <div className="flex items-start space-x-2">
                <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-1 flex-shrink-0" />
                <p className="text-blue-900 dark:text-blue-100 leading-relaxed">
                  {content}
                </p>
              </div>
            </CardContent>
          </Card>
        );

      case 'example':
        return (
          <Card className="bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800">
            <CardContent className="p-4">
              <div className="flex items-start space-x-2">
                <Lightbulb className="w-4 h-4 text-orange-600 dark:text-orange-400 mt-1 flex-shrink-0" />
                <p className="text-orange-900 dark:text-orange-100 leading-relaxed italic">
                  {content}
                </p>
              </div>
            </CardContent>
          </Card>
        );

      case 'connection':
        return (
          <Card className="bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800">
            <CardContent className="p-4">
              <div className="flex items-start space-x-2">
                <Link className="w-4 h-4 text-purple-600 dark:text-purple-400 mt-1 flex-shrink-0" />
                <p className="text-purple-900 dark:text-purple-100 leading-relaxed">
                  {content}
                </p>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return (
          <li className="text-foreground leading-relaxed">
            {content}
          </li>
        );
    }
  };

  return (
    <div ref={contentRef} className="space-y-8">
      {/* Sections */}
      {studyPack.sections.map((section, sectionIndex) => (
        <section
          key={sectionIndex}
          id={`section-${sectionIndex}`}
          ref={(el) => {
            if (el) sectionRefs.current[`section-${sectionIndex}`] = el;
          }}
          className="space-y-6"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-foreground border-b border-border pb-2">
            {section.heading}
          </h2>

          {/* Points */}
          {section.points.length > 0 && (
            <div className="space-y-3">
              <ul className="space-y-2 list-disc list-inside">
                {section.points.map((point, pointIndex) => (
                  <li key={pointIndex} className="text-foreground leading-relaxed">
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Definitions */}
          {section.definitions && section.definitions.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-lg font-semibold text-foreground flex items-center">
                <FileText className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
                Definitions
              </h4>
              <div className="space-y-3">
                {section.definitions.map((definition, defIndex) => (
                  <div key={defIndex}>
                    {renderContentItem(definition, 'definition')}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Examples */}
          {section.examples && section.examples.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-lg font-semibold text-foreground flex items-center">
                <Lightbulb className="w-5 h-5 mr-2 text-orange-600 dark:text-orange-400" />
                Examples
              </h4>
              <div className="space-y-3">
                {section.examples.map((example, exampleIndex) => (
                  <div key={exampleIndex}>
                    {renderContentItem(example, 'example')}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Connections */}
          {section.connections && section.connections.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-lg font-semibold text-foreground flex items-center">
                <Link className="w-5 h-5 mr-2 text-purple-600 dark:text-purple-400" />
                Connections
              </h4>
              <div className="space-y-3">
                {section.connections.map((connection, connectionIndex) => (
                  <div key={connectionIndex}>
                    {renderContentItem(connection, 'connection')}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Subsections */}
          {section.subsections && section.subsections.map((subsection, subsectionIndex) => (
            <div
              key={subsectionIndex}
              id={`subsection-${sectionIndex}-${subsectionIndex}`}
              ref={(el) => {
                if (el) sectionRefs.current[`subsection-${sectionIndex}-${subsectionIndex}`] = el;
              }}
              className="ml-6 space-y-4 border-l-2 border-muted pl-6"
            >
              <h3 className="text-xl md:text-2xl font-semibold text-foreground">
                {subsection.subheading}
              </h3>

              {subsection.points.length > 0 && (
                <ul className="space-y-2 list-disc list-inside">
                  {subsection.points.map((point, pointIndex) => (
                    <li key={pointIndex} className="text-foreground leading-relaxed">
                      {point}
                    </li>
                  ))}
                </ul>
              )}

              {subsection.definitions && subsection.definitions.length > 0 && (
                <div className="space-y-2">
                  {subsection.definitions.map((definition, defIndex) => (
                    <div key={defIndex}>
                      {renderContentItem(definition, 'definition')}
                    </div>
                  ))}
                </div>
              )}

              {subsection.examples && subsection.examples.length > 0 && (
                <div className="space-y-2">
                  {subsection.examples.map((example, exampleIndex) => (
                    <div key={exampleIndex}>
                      {renderContentItem(example, 'example')}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </section>
      ))}

      {/* Key Takeaways */}
      {studyPack.key_takeaways && studyPack.key_takeaways.length > 0 && (
        <section
          id="key-takeaways"
          ref={(el) => {
            if (el) sectionRefs.current['key-takeaways'] = el;
          }}
          className="space-y-4"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-foreground border-b border-border pb-2 flex items-center">
            <Star className="w-6 h-6 mr-2 text-yellow-600 dark:text-yellow-400" />
            Key Takeaways
          </h2>
          <Card className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
            <CardContent className="p-6">
              <ul className="space-y-3">
                {studyPack.key_takeaways.map((takeaway, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <Badge variant="secondary" className="mt-1 flex-shrink-0">
                      {index + 1}
                    </Badge>
                    <span className="text-yellow-900 dark:text-yellow-100 leading-relaxed font-medium">
                      {takeaway}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </section>
      )}

      {/* Summary */}
      <section
        id="summary"
        ref={(el) => {
          if (el) sectionRefs.current['summary'] = el;
        }}
        className="space-y-4"
      >
        <h2 className="text-2xl md:text-3xl font-bold text-foreground border-b border-border pb-2 flex items-center">
          <BookOpen className="w-6 h-6 mr-2 text-green-600 dark:text-green-400" />
          Summary
        </h2>
        <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
          <CardContent className="p-6">
            <p className="text-green-900 dark:text-green-100 leading-relaxed text-lg">
              {studyPack.summary}
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};
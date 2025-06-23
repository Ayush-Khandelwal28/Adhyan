import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, Clock, FileText } from 'lucide-react';
import { StudyPackData } from '@/lib/types';

interface StudyPackHeaderProps {
  studyPack: StudyPackData;
}

export const StudyPackHeader: React.FC<StudyPackHeaderProps> = ({ studyPack }) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="mb-8">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-4">
        <Link href="/dashboard" className="hover:text-foreground transition-colors">
          Dashboard
        </Link>
        <span>/</span>
        <span className="text-foreground font-medium">{studyPack.title}</span>
      </nav>

      {/* Header Content */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center space-x-3">
            <Link href="/dashboard">
              <Button variant="outline" size="sm" className="flex items-center space-x-2">
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Dashboard</span>
              </Button>
            </Link>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            {studyPack.title}
          </h1>
        </div>

        {/* Metadata */}
        {studyPack.metadata && (
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            {studyPack.metadata.createdAt && (
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>Created {formatDate(studyPack.metadata.createdAt)}</span>
              </div>
            )}
            {studyPack.metadata.lastAccessed && (
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>Modified {formatDate(studyPack.metadata.lastAccessed)}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
export interface StudyNotesStructure {
  title: string;
  sections: StudyNotesSection[];
  key_takeaways?: string[];
  summary: string;
}

export interface StudyNotesSection {
  heading: string;
  points: string[];
  definitions?: string[];
  examples?: string[];
  connections?: string[];
  subsections?: StudyNotesSubsection[];
}

export interface StudyNotesSubsection {
  subheading: string;
  points: string[];
  definitions?: string[];
  examples?: string[];
  connections?: string[];
}

export interface ParseResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  raw?: string;
  fixes_applied?: string[];
}

export interface FlashcardAvailability {
  definition: number;
  recall: number;
  application: number;
}

export interface Flashcard {
  type: 'definition' | 'recall' | 'application';
  front: string;
  back: string;
}

export interface RecallContentItem {
    content: string;
    source: {
        section: string;
        subsection?: string;
        type: 'point' | 'key_takeaway';
        index: number;
    };
    context?: string; 
}

export interface RecallContentCollection {
    items: RecallContentItem[];
    totalCount: number;
}

export interface ApplicationContentItem {
    content: string;
    source: {
        section: string;
        subsection?: string;
        type: 'example' | 'connection';
        index: number;
    };
    context?: string;
    relatedConcepts?: string[];
}

export interface ApplicationContentCollection {
    items: ApplicationContentItem[];
    totalCount: number;
    breakdown: {
        sectionExamples: { section: string; count: number }[];
        sectionConnections: { section: string; count: number }[];
        subsectionExamples: { section: string; subsection: string; count: number }[];
        subsectionConnections: { section: string; subsection: string; count: number }[];
    };
}
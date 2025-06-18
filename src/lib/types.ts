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

export interface QuizContentConfig {
  includeSubsections?: boolean;
  minPointsPerSection?: number;
}

export interface ExtractedQuizContent {
  title: string;
  summary: string;
  totalSections: number;
  extractedSections: QuizSection[];
  metadata: {
    totalPoints: number;
    totalDefinitions: number;
    totalExamples: number;
    contentTypes: string[];
  };
}

export interface QuizSection {
  heading: string;
  level: 'main' | 'sub';
  parentHeading?: string;
  points: string[];
  definitions: string[];
  examples: string[];
  score: number; 
}

export interface MCQOption {
  text: string;
  isCorrect: boolean;
}

export interface MCQQuestion {
  type: 'MCQ';
  question: string;
  options: MCQOption[];
  explanation?: string;
}

export interface TrueFalseQuestion {
  type: 'TRUE_FALSE';
  statement: string;
  isTrue: boolean;
  explanation?: string;
}


export interface Quiz {
    title: string;
    questions: QuizQuestion[];
    totalQuestions: number;
}

export type QuizQuestion = MCQQuestion | TrueFalseQuestion;

export type QuestionType = 'MCQ' | 'TRUE_FALSE';
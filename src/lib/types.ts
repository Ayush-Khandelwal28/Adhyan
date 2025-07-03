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

export interface ParseResult<T = unknown> {
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
}

export interface QuizContentConfig {
  includeSubsections?: boolean;
  minPointsPerSection?: number;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
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

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }

  interface User {
    id: string;
    password?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId?: string;
  }
}

export interface StudyPack {
  id: string;
  title: string;
  createdAt: string;
  lastAccessed: string;
  type: string;
}

export interface FlashcardGroup {
  type: 'definition' | 'recall' | 'application';
  flashcards: Flashcard[];
}

export interface FlashcardData {
  message: string;
  data: FlashcardGroup[];
}

export interface StudySession {
  totalCards: number;
  currentIndex: number;
  correctCount: number;
  wrongCount: number;
  completedCards: Set<number>;
  needReviewCards: Set<number>;
}

export interface FilterState {
  definitions: boolean;
  recall: boolean;
  application: boolean;
}

export interface QuizResponse {
  message: string;
  data: Quiz;
}

export interface UserAnswer {
  questionIndex: number;
  answer: boolean | number;
  isCorrect: boolean;
}

export interface QuizState {
  currentQuestionIndex: number;
  userAnswers: Map<number, UserAnswer>;
  isCompleted: boolean;
  showResults: boolean;
  showReview: boolean;
  score: number;
}

export type QuizPhase = 'taking' | 'results' | 'review';

export interface StudyPackData {
  title: string;
  notesJson: StudyNotesStructure;
  metadata?: {
    createdAt?: string;
    lastAccessed?: string;
  };
}

export interface TableOfContentsItem {
  id: string;
  title: string;
  level: number;
  children?: TableOfContentsItem[];
}

export interface SearchResult {
  sectionIndex: number;
  subsectionIndex?: number;
  contentType: 'heading' | 'point' | 'definition' | 'example' | 'connection' | 'takeaway' | 'summary';
  content: string;
  context: string;
}

export interface QuizData {
  id: string;
  title: string;
  type: 'MCQ' | 'TRUE_FALSE';
  questionCount: number;
  lastAttempted?: string;
  lastScore?: number;
  totalAttempts: number;
  createdAt: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface QuizFilters {
  type: 'ALL' | 'MCQ' | 'TRUE_FALSE';
  difficulty: 'ALL' | 'Easy' | 'Medium' | 'Hard';
}

export interface QuizSortOption {
  field: 'lastAttempted' | 'createdAt' | 'lastScore';
  direction: 'asc' | 'desc';
}

export interface NewQuizRequest {
  type: 'MCQ' | 'TRUE_FALSE';
  questionCount: 5 | 10 | 15 | 20;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  title?: string;
}

export interface QuizzesResponse {
  success: boolean;
  data: {
    studyPackId: string;
    studyPackTitle: string;
    quizzes: QuizData[];
    totalQuizzes: number;
  };
}

export interface MindMapStructure {
  central_concept: string;
  branches: MindMapBranch[];
}

export interface MindMapBranch {
  branch_label: string;
  main_nodes: MindMapNode[];
}

export interface MindMapNode {
  label: string;
  node_type: 'concept' | 'detail' | 'example';
  children?: MindMapNode[];
  emphasis_level?: 'high' | 'medium' | 'low';
}

// Internal types for ReactFlow
export interface MindMapNodeData {
  label: string;
  content: string;
  type: 'central' | 'branch' | 'main_node' | 'child_node';
  nodeType: 'concept' | 'detail' | 'example';
  emphasisLevel?: 'high' | 'medium' | 'low';
  isExpanded: boolean;
  childrenIds: string[];
  parentId?: string;
  originalData?: MindMapNode | MindMapBranch;
  nodeKey: string;
  hasExpandableChildren: boolean;
  angle?: number;
  childrenAngles?: number[];
}

export type ReactFlowNode = import('reactflow').Node<MindMapNodeData>;
export type ReactFlowEdge = import('reactflow').Edge;
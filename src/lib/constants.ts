import { FileText, Youtube, Type, Eye, Map, BookOpen, Zap } from 'lucide-react';

export const CONTENT_TYPES = {
  TEXT: {
    id: 'text',
    icon: Type,
    label: 'Text',
    color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30',
    accept: '.txt'
  },
  PDF: {
    id: 'file',
    icon: FileText,
    label: 'PDF',
    color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30',
    accept: '.pdf'
  },
  YOUTUBE: {
    id: 'link',
    icon: Youtube,
    label: 'YouTube',
    color: 'bg-red-100 text-red-700 dark:bg-red-900/30',
    accept: null
  }
} as const;

export const STUDY_PACK_ACTIONS = [
  { icon: Eye, label: 'Notes' },
  { icon: Map, label: 'Mind Map' },
  { icon: BookOpen, label: 'Flashcards' },
  { icon: Zap, label: 'Quiz' },
] as const;
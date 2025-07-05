'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { StudyPackData } from '@/lib/types';

interface StudyPackContextType {
  studyPack: StudyPackData | null;
  isLoading: boolean;
  error: string | null;
  studyPackId: string;
  fetchStudyPack: (id: string) => Promise<void>;
}

const StudyPackContext = createContext<StudyPackContextType | undefined>(undefined);

export const useStudyPack = (): StudyPackContextType => {
  const context = useContext(StudyPackContext);
  if (!context) {
    throw new Error('useStudyPack must be used within a StudyPackProvider');
  }
  return context;
};

interface StudyPackProviderProps {
  children: ReactNode;
  studyPackId: string;
}

export const StudyPackProvider: React.FC<StudyPackProviderProps> = ({ children, studyPackId }) => {
  const [studyPack, setStudyPack] = useState<StudyPackData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStudyPack = async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(`/api/studypacks/${id}`);
      if (response.ok) {
        const data = await response.json();
        setStudyPack(data.studyPack as StudyPackData);
      } else {
        setError('Failed to fetch study pack');
      }
    } catch (err) {
      setError('Error fetching study pack');
      console.error('Error fetching study pack:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (studyPackId) {
      fetchStudyPack(studyPackId);
    }
  }, [studyPackId]);

  const value: StudyPackContextType = {
    studyPack,
    isLoading,
    error,
    studyPackId,
    fetchStudyPack,
  };

  return (
    <StudyPackContext.Provider value={value}>
      {children}
    </StudyPackContext.Provider>
  );
};

import { useState, useEffect } from 'react';
import { StudyPack } from '@/lib/types';

export function useStudyPacks() {
  const [studyPacks, setStudyPacks] = useState<StudyPack[]>([]);
  const [recentlyAccessed, setRecentlyAccessed] = useState<StudyPack[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const getStudyPacks = async () => {
    try {
      const response = await fetch('/api/studypacks');
      if (response.ok) {
        const data = await response.json();
        setStudyPacks(data.studyPacks);
        const recent = [...data.studyPacks]
          .filter(pack => pack.lastAccessed)
          .sort((a, b) => {
            const aTime = new Date(a.lastAccessed).getTime();
            const bTime = new Date(b.lastAccessed).getTime();
            return bTime - aTime;
          })
          .slice(0, 4);
        setRecentlyAccessed(recent);
      }
    } catch (error) {
      console.error("Failed to fetch study packs:", error);
    }
  };

  useEffect(() => {
    getStudyPacks().finally(() => setIsLoading(false));
  }, []);

  return { studyPacks, recentlyAccessed, isLoading };
}
'use client';

import { DashboardLoading } from '@/components/dashboard/loading';
import { UploadSection } from '@/components/dashboard/Upload';
import { RecentlyAccessed } from '@/components/dashboard/RecentlyAccessed';
import { AllStudyPacks } from '@/components/dashboard/AllStudyPacks';
import { useStudyPacks } from '@/hooks/usestudyPacks';

export default function Dashboard() {
  const { studyPacks, recentlyAccessed, isLoading } = useStudyPacks();
  console.log('studyPacks', studyPacks);
  console.log('recentlyAccessed', recentlyAccessed);

  if (isLoading) return <DashboardLoading />;

  return (
    <>
      <UploadSection />
      {recentlyAccessed.length > 0 && (
        <RecentlyAccessed recentlyAccessed={recentlyAccessed} />
      )}
      <AllStudyPacks studyPacks={studyPacks} />
    </>
  );
}

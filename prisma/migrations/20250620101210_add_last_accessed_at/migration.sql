-- AlterTable
ALTER TABLE "StudyPack" ADD COLUMN     "lastAccessedAt" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "StudyPack_lastAccessedAt_idx" ON "StudyPack"("lastAccessedAt");

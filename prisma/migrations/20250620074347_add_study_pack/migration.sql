-- CreateTable
CREATE TABLE "StudyPack" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "sourceType" TEXT NOT NULL,
    "sourceUrl" TEXT,
    "notesJson" JSONB NOT NULL,
    "flashcardsJson" JSONB,
    "quizJson" JSONB,
    "mindmapJson" JSONB,
    "flashcardAvailabilityJson" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StudyPack_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "StudyPack_userId_idx" ON "StudyPack"("userId");

-- AddForeignKey
ALTER TABLE "StudyPack" ADD CONSTRAINT "StudyPack_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

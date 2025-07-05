import { NextRequest, NextResponse } from 'next/server';
import extractPdfText from '@/lib/contentUpload/parsePDF';
import { validateYtLink, getContentFromYoutube } from '@/lib/contentUpload/ytUtils';
import { prepareTextForChunking } from '@/lib/contentUpload/processContent';
import { getTextStatistics } from '@/lib/contentUpload/processContent';
import { generateStructuredNotes } from '@/lib/langchain/uploadContent';
import { analyzeFlashcardEligibility } from '@/lib/flashCards/flashCardsCalculator';
import { StudyNotesStructure } from '@/lib/types';
import prisma from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth/getCurrentUser";

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();

        console.log('Received form data:', formData);

        const contentType = formData.get('contentType');
        const file = formData.get('file');
        const text = formData.get('text');
        const link = formData.get('link');

        let content

        if (contentType === 'text') {
            content = text
        } else if (contentType === 'file') {
            if (!file || !(file instanceof Blob)) {
                console.log("No file received");
                return NextResponse.json({ error: "No file received." }, { status: 400 });
            }
            const buffer = Buffer.from(await file.arrayBuffer());
            content = await extractPdfText(buffer);
        } else if (contentType === 'link') {
            if (!link || typeof link !== 'string') {
                return NextResponse.json({ error: 'Missing or invalid link format' }, { status: 400 });
            }
            if (validateYtLink(link) === false) {
                return NextResponse.json({ error: 'Invalid YouTube link' }, { status: 400 });
            }
            content = await getContentFromYoutube(link);
        }

        if (!content || typeof content !== 'string') {
            return NextResponse.json({ error: 'Error creating content' }, { status: 400 });
        }

        const stats = getTextStatistics(content);
        console.log('Text Statistics:', stats);

        const chunks = prepareTextForChunking(content, {
            preserveSentences: true,
            minChunkSize: 100,
            maxChunkSize: 1000,
        });

        if (chunks.length === 0) {
            return NextResponse.json({ error: 'No valid chunks created' }, { status: 400 });
        }

        console.log('creating notes for content:');

        const notes = await generateStructuredNotes(content);

        console.log('Generated notes:', notes);

        const availability = analyzeFlashcardEligibility(notes as StudyNotesStructure);

        const userId = await getCurrentUserId();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const notesUpload = await prisma.studyPack.create({
            data: {
                userId,
                title: notes.title,
                sourceType: contentType as string,
                sourceUrl: contentType === 'link' ? link as string : null,
                notesJson: JSON.stringify(notes),
                flashcardAvailabilityJson: JSON.stringify(availability),
            }
        });

        console.log('Study Pack created:', notesUpload);

        if (!notesUpload) {
            return NextResponse.json({ error: 'Failed to create study pack' }, { status: 500 });
        }

        const studyPackId = notesUpload.id;

        return NextResponse.json({ message: 'Upload successful', data: { studyPackId } }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { error: (error instanceof Error ? error.message : 'Failed to upload Content') },
            { status: 500 }
        );
    }
}


import { NextResponse } from 'next/server';
import generateDefinitionFlashcards from '@/lib/flashCards/definitionFlashCards';
import generateRecallFlashcards from '@/lib/flashCards/recallFlashCards';
import getApplicationFlashcards from '@/lib/flashCards/applicationFlashCards';
import { getCurrentUserId } from '@/lib/auth/getCurrentUser';
import prisma from '@/lib/prisma';
import { StudyNotesStructure } from '@/lib/types';

export async function POST(request: Request) {
    try {

        const userId = await getCurrentUserId();

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const data = await request.json();

        console.log('Received data:', data);

        const { id: studyPackId, definition, recall, application }: { id: string, definition: boolean; recall: boolean; application: boolean } = data;

        console.log('Parsed data:', { studyPackId, definition, recall, application });

        if (!studyPackId) {
            return NextResponse.json({ error: 'Missing study pack ID' }, { status: 400 });
        }

        if (definition === undefined || recall === undefined || application === undefined) {
            return NextResponse.json({ error: 'Missing flashcard type flags' }, { status: 400 });
        }

        if (typeof definition !== 'boolean' || typeof recall !== 'boolean' || typeof application !== 'boolean') {
            return NextResponse.json({ error: 'Invalid flashcard data' }, { status: 400 });
        }

        if (!definition && !recall && !application) {
            return NextResponse.json({ error: 'At least one flashcard type must be true' }, { status: 400 });
        }

        console.log('Fetching study pack with ID:', studyPackId);

        const studyPack = await prisma.studyPack.findFirst({
            where: {
                id: studyPackId,
                userId,
            },
            select: {
                notesJson: true,
            },
        });

        if (!studyPack) {
            return NextResponse.json({ error: 'Study pack not found' }, { status: 404 });
        }

        // Parse and validate the JSON data
        let parsedNotesJson: StudyNotesStructure;
        try {
            parsedNotesJson = typeof studyPack.notesJson === 'string'
                ? JSON.parse(studyPack.notesJson)
                : studyPack.notesJson;
        } catch (error) {
            return NextResponse.json({ error: error instanceof Error ? error.message : 'Invalid notes data format' }, { status: 500 });
        }

        const flashcards = [];

        if (definition) {
            console.log('Generating definition flashcards');
            const definitionFlashcards = generateDefinitionFlashcards(parsedNotesJson);
            flashcards.push({ type: 'definition', flashcards: definitionFlashcards });
        }

        if (recall) {
            const recallFlashcards = await generateRecallFlashcards(parsedNotesJson);
            flashcards.push({ type: 'recall', flashcards: recallFlashcards });
        }

        if (application) {
            const applicationFlashcards = await getApplicationFlashcards(parsedNotesJson);
            flashcards.push({ type: 'application', flashcards: applicationFlashcards });
        }

        console.log('All flashcards generated successfully');

        const flashcardUpload = await prisma.studyPack.update({
            where: {
                id: studyPackId
            },
            data: {
                flashcardsJson: JSON.stringify(flashcards)
            }
        });

        if (!flashcardUpload) {
            return NextResponse.json({ error: 'Failed to update study pack with flashcards' }, { status: 500 });
        }

        return NextResponse.json({ message: 'Flashcard created', data: flashcards }, { status: 200 });
    } catch (error) {
        console.error('Error generating flashcards:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
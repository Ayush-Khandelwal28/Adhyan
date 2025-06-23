import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUserId } from '@/lib/auth/getCurrentUser';
import { FlashcardAvailability } from '@/lib/types';

export async function GET(request: Request) {
    const userId = await getCurrentUserId();

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!id) {
        return NextResponse.json({ error: 'Study pack ID is required' }, { status: 400 });
    }

    const studyPackFlashcards = await prisma.studyPack.findFirst({
        where: {
            id,
            userId,
        },
        select: {
            flashcardsJson: true,
            flashcardAvailabilityJson: true,
        },
    });

    if (!studyPackFlashcards) {
        return NextResponse.json({ error: 'Study pack not found' }, { status: 404 });
    }

    const isFlashcardsAvailable = studyPackFlashcards.flashcardsJson ? true : false;
    
    let flashcardAvailabilityJson: FlashcardAvailability;
    try {
        flashcardAvailabilityJson = typeof studyPackFlashcards.flashcardAvailabilityJson === 'string'
            ? JSON.parse(studyPackFlashcards.flashcardAvailabilityJson)
            : studyPackFlashcards.flashcardAvailabilityJson;
    } catch (error) {
        return NextResponse.json({ error: 'Invalid flashcard availability format' }, { status: 500 });
    }

    let flashcardsJson;
    if(isFlashcardsAvailable){
        try {
            flashcardsJson = typeof studyPackFlashcards.flashcardsJson === 'string'
                ? JSON.parse(studyPackFlashcards.flashcardsJson)
                : studyPackFlashcards.flashcardsJson;
        } catch (error) {
            return NextResponse.json({ error: 'Invalid flashcards format' }, { status: 500 });
        }
    }


    return NextResponse.json({
        message: 'Study pack retrieved successfully',
        isFlashcardsAvailable,
        flashcardAvailabilityJson,
        ...(isFlashcardsAvailable && { flashcards: flashcardsJson })
    }, { status: 200 });
}

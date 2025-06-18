import { NextResponse } from 'next/server';
import generateDefinitionFlashcards from '@/lib/flashCards/definitionFlashCards';
import generateRecallFlashcards from '@/lib/flashCards/recallFlashCards';
import getApplicationFlashcards from '@/lib/flashCards/applicationFlashCards';
import content from '@/lib/mockdata/ml1.json';

export async function POST(request: Request) {
    try {
        const data = await request.json();

        console.log('Received data:', data);

        const mlContent = content.data

        const { definition, recall, application }: { definition: boolean; recall: boolean; application: boolean } = data;

        if (definition === undefined || recall === undefined || application === undefined) {
            return NextResponse.json({ error: 'Missing flashcard type flags' }, { status: 400 });
        }

        if (typeof definition !== 'boolean' || typeof recall !== 'boolean' || typeof application !== 'boolean') {
            return NextResponse.json({ error: 'Invalid flashcard data' }, { status: 400 });
        }

        if (!definition && !recall && !application) {
            return NextResponse.json({ error: 'At least one flashcard type must be true' }, { status: 400 });
        }

        console.log('checks passed');

        const flashcards = [];

        if (definition) {
            console.log('Generating definition flashcards');
            const definitionFlashcards = generateDefinitionFlashcards(mlContent);
            if (!definitionFlashcards || definitionFlashcards.length === 0) {
                return NextResponse.json({ error: 'No definition flashcards created' }, { status: 400 });
            }
            flashcards.push({ type: 'definition', flashcards: definitionFlashcards });
        }

        if (recall) {
            const recallFlashcards = await generateRecallFlashcards(mlContent);
            if (!recallFlashcards || recallFlashcards.length === 0) {
                return NextResponse.json({ error: 'No recall flashcards created' }, { status: 400 });
            }
            flashcards.push({ type: 'recall', flashcards: recallFlashcards });
        }

        if (application) {
            const applicationFlashcards = await getApplicationFlashcards(mlContent);
            if (!applicationFlashcards || applicationFlashcards.length === 0) {
                return NextResponse.json({ error: 'No application flashcards created' }, { status: 400 });
            }
            flashcards.push({ type: 'application', flashcards: applicationFlashcards });
        }

        console.log('All flashcards generated successfully');  

        return NextResponse.json({ message: 'Flashcard created', data: flashcards }, { status: 200 });
    } catch (error) {
        console.error('Error generating flashcards:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
import { NextResponse } from 'next/server';
import generateMindmap from '@/lib/langchain/generateMindmap';
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

        const { id: studyPackId }: { id: string } = data;

        console.log('Parsed data:', { studyPackId });

        if (!studyPackId) {
            return NextResponse.json({ error: 'Missing study pack ID' }, { status: 400 });
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
            return NextResponse.json({ error: 'Invalid notes data format' }, { status: 500 });
        }

        const mindmap = await generateMindmap(parsedNotesJson);

        if (!mindmap) {
            return NextResponse.json({ error: 'Failed to generate mindmap' }, { status: 500 });
        }

        const mindmapUpload = await prisma.studyPack.update({
            where: {
                id: studyPackId
            },
            data: {
                mindmapJson: JSON.stringify(mindmap),
            }
        });

        if (!mindmapUpload) {
            return NextResponse.json({ error: 'Failed to save mindmap' }, { status: 500 });
        }

        console.log('Mindmap generated and saved successfully:', mindmap);

        return NextResponse.json({ message: 'Mindmap created', data: mindmap }, { status: 200 });
    } catch (error) {
        console.error('Error generating flashcards:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
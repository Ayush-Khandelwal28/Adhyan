import { NextResponse } from 'next/server';
import { getCurrentUserId } from '@/lib/auth/getCurrentUser';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
    try {
        const userId = await getCurrentUserId();

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const searchParams = new URL(request.url).searchParams;
        const studyPackId = searchParams.get('studyPackId');

        if (!studyPackId) {
            return NextResponse.json({ error: 'Missing study pack ID' }, { status: 400 });
        }

        const studyPack = await prisma.studyPack.findFirst({
            where: {
                id: studyPackId,
                userId,
            },
            select: {
                mindmapJson: true,
            },
        });

        if (!studyPack) {
            return NextResponse.json({ error: 'Study pack not found' }, { status: 404 });
        }

        if (!studyPack.mindmapJson) {
            return NextResponse.json({ error: 'Mindmap not found for this study pack' }, { status: 404 });
        }

        const mindmap = typeof studyPack.mindmapJson === 'string' 
            ? JSON.parse(studyPack.mindmapJson) 
            : studyPack.mindmapJson;

        return NextResponse.json({ message: 'Mindmap retrieved', data: mindmap }, { status: 200 });
    } catch (error) {
        console.error('Error retrieving mindmap:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

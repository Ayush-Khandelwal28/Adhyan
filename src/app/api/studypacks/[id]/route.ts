import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUserId } from '@/lib/auth/getCurrentUser';
import { StudyPackData, StudyNotesStructure } from '@/lib/types';

export async function GET(request: Request, { params }: { params: { id: string } }) {
    const userId = await getCurrentUserId();

    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const studyPack = await prisma.studyPack.findFirst({
        where: {
            id: params.id,
            userId,
        },
        select: {
            id: true,
            title: true,
            notesJson: true,
            createdAt: true,
            lastAccessedAt: true,
            sourceType: true,
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

    const formattedStudyPack: StudyPackData = {
        title: studyPack.title,
        notesJson: parsedNotesJson,
        metadata: {
            createdAt: studyPack.createdAt.toISOString(),
            lastAccessed: studyPack.lastAccessedAt?.toISOString()
        }
    };

    return NextResponse.json({ message: 'Study pack retrieved successfully', studyPack: formattedStudyPack }, { status: 200 });
}

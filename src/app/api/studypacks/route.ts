import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUserId } from '@/lib/auth/getCurrentUser';

export async function GET() {
    const userId = await getCurrentUserId();

    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const studyPacks = await prisma.studyPack.findMany({
        where: { userId },
        orderBy: { createdAt: 'asc' },
        select: {
            id: true,
            title: true,
            createdAt: true,
            lastAccessedAt: true,
            sourceType: true,
        },
    });

    const formatted = studyPacks.map((pack) => ({
        id: pack.id,
        title: pack.title,
        createdAt: pack.createdAt.toISOString(),
        lastAccessed: pack.lastAccessedAt?.toISOString() ?? '',
        type: pack.sourceType,
    }));

    return NextResponse.json({message : 'Study packs retrieved successfully', studyPacks: formatted}, { status: 200 });
}

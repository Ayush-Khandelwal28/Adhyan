import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUserId } from '@/lib/auth/getCurrentUser';

export async function POST(req: Request) {
  try {
    const { quizId, score } = await req.json();

    if (!quizId  || typeof score !== 'number') {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const userId = await getCurrentUserId();
    if (!userId) {
      return NextResponse.json({ message: 'User not authenticated' }, { status: 401 });
    }

    const createAttempt = await prisma.quizAttempt.create({
      data: {
        quizId,
        userId,
        score,
      },
    });

    if (!createAttempt) {
      return NextResponse.json({ message: 'Failed to save attempt' }, { status: 500 });
    }

    // Fetch all attempts for this quiz
    const attempts = await prisma.quizAttempt.findMany({
      where: { quizId },
    });

    const totalAttempts = attempts.length;

    return NextResponse.json({
      message: 'Attempt saved successfully',
      data: {
        quizId,
        totalAttempts
      },
    });
  } catch (error) {
    console.error('Error saving quiz attempt:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

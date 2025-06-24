import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const studyPackId = searchParams.get('studyPackId');

  if (!studyPackId) {
    return NextResponse.json({ message: 'Missing studyPackId' }, { status: 400 });
  }

  try {
    const quizzes = await prisma.quiz.findMany({
      where: { studyPackId },
      include: {
        quizAttempts: {
          orderBy: { attemptedAt: 'desc' }
        }
      },
      orderBy: { createdAt: 'desc' },
    });

    const quizData = quizzes.map((quiz) => {
      const totalAttempts = quiz.quizAttempts.length;
      const lastAttempt = quiz.quizAttempts[0];

      return {
        id: quiz.id,
        title: quiz.title,
        type: quiz.type as 'MCQ' | 'TRUE_FALSE',
        questionCount: (quiz.questions as any[]).length,
        difficulty: quiz.difficulty as 'Easy' | 'Medium' | 'Hard',
        createdAt: quiz.createdAt.toISOString(),
        lastAttempted: lastAttempt?.attemptedAt.toISOString(),
        lastScore: lastAttempt?.score,
        totalAttempts
      };
    });

    console.log('Response from GET /api/quiz/all:', quizData);

    return NextResponse.json({ message: 'Success', data: quizData });
  } catch (error) {
    console.error('[GET_QUIZZES_ERROR]', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

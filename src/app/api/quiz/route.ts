import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const quizId = searchParams.get('quizId');

    if (!quizId) {
        return NextResponse.json({ message: 'Missing quizId' }, { status: 400 });
    }

    try {
        const quiz = await prisma.quiz.findUnique({
            where: { id: quizId },
        });

        if (!quiz) {
            return NextResponse.json({ message: 'Quiz not found' }, { status: 404 });
        }

        const questions = quiz.questions as any[]; // your questions are stored as JSON

        const response = {
            title: quiz.title,
            questions,
            totalQuestions: questions.length,
        };

        return NextResponse.json({ message: 'Success', data: response });
    } catch (error) {
        console.error('[GET_QUIZ_ERROR]', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

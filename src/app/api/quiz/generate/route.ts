import { NextResponse } from 'next/server';
import { QuizContentExtractor } from '@/lib/quizzes/extractContentForQuizzes';
import { QuizContentConfig } from '@/lib/types';
import prisma from '@/lib/prisma';
import { getCurrentUserId } from '@/lib/auth/getCurrentUser';
import generateQuiz from '@/lib/quizzes/generateQuiz';

export async function POST(request: Request) {
    try {
        const data = await request.json();

        const userId = await getCurrentUserId();

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { quizTitle, quizType, questionCount, difficulty } = data;

        if (!quizTitle || typeof quizTitle !== 'string' || quizTitle.trim() === '') {
            return NextResponse.json({ error: 'Quiz Title is not valid' }, { status: 400 });
        }


        if (!quizType) {
            return NextResponse.json({ error: 'Quiz type is required' }, { status: 400 });
        }

        if (typeof quizType !== 'string' || quizType !== 'MCQ' && quizType !== 'TRUE_FALSE') {
            return NextResponse.json({ error: 'Invalid quiz type' }, { status: 400 });
        }

        if (questionCount && (typeof questionCount !== 'number' || questionCount <= 0)) {
            return NextResponse.json({ error: 'Invalid question count' }, { status: 400 });
        }

        if (difficulty && typeof difficulty !== 'string' && !['Easy', 'Medium', 'Hard'].includes(difficulty)) {
            return NextResponse.json({ error: 'Invalid difficulty level' }, { status: 400 });
        }

        const config: QuizContentConfig = {
            includeSubsections: true,
            minPointsPerSection: 2,
            difficulty: difficulty || 'Medium',
        };

        const notes = await prisma.studyPack.findFirst({
            where: { userId, id: data.studyPackId },
            select: {
                notesJson: true,
            },
        });

        if (!notes || !notes.notesJson) {
            return NextResponse.json({ error: 'Study pack not found or empty' }, { status: 404 });
        }

        const quizContent = typeof notes.notesJson === 'string'
            ? JSON.parse(notes.notesJson)
            : notes.notesJson;
        if (!quizContent) {
            return NextResponse.json({ error: 'Invalid study pack content' }, { status: 400 });
        }

        const extractedContent = QuizContentExtractor.extractContentForQuizzes(quizContent, config);

        const generatedQuiz = await generateQuiz(quizType, extractedContent, { questionCount: questionCount, includeExplanations: true });

        const uploadQuiz = await prisma.quiz.create({
            data: {
                studyPackId: data.studyPackId,
                title: generatedQuiz.title || 'Untitled Quiz',
                type: quizType,
                difficulty: difficulty || 'Medium',
                questions: JSON.parse(JSON.stringify(generatedQuiz.questions)),
                questionCount: generatedQuiz.totalQuestions,
                createdAt: new Date()
            },
            select: {
                id: true,
                title: true,
                type: true,
                difficulty: true,
                questionCount: true,
                createdAt: true,
            }
        });

        if (!uploadQuiz) {
            return NextResponse.json({ error: 'Failed to create quiz' }, { status: 500 });
        }

        return NextResponse.json({ message: 'Success', data: uploadQuiz }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: (error instanceof Error ? error.message : 'Internal Server Error') }, { status: 500 });
    }
}
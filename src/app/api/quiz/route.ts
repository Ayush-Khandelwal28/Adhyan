import { NextResponse } from 'next/server';
import { QuizContentExtractor } from '@/lib/quizzes/extractContentForQuizzes';
import { QuizContentConfig } from '@/lib/types';
import mlContent from '@/lib/mockdata/ml1.json';
import generateQuiz from '@/lib/quizzes/generateQuiz';

export async function POST(request: Request) {
    try {
        const data = await request.json();

        const {quizType, questionCount} = data;

        if (!quizType) {
            return NextResponse.json({ error: 'Quiz type is required' }, { status: 400 });
        }

        if (typeof quizType !== 'string' || quizType !== 'MCQ' && quizType !== 'TRUE_FALSE') {
            return NextResponse.json({ error: 'Invalid quiz type' }, { status: 400 });
        }

        if (questionCount && (typeof questionCount !== 'number' || questionCount <= 0)) {
            return NextResponse.json({ error: 'Invalid question count' }, { status: 400 });
        }

        const config: QuizContentConfig = {
            includeSubsections: true,
            minPointsPerSection: 2,
        };

        const extractedContent = QuizContentExtractor.extractContentForQuizzes(mlContent.data, config);

        const generatedQuiz = await generateQuiz(quizType, extractedContent, {questionCount: questionCount, includeExplanations: true});

        return NextResponse.json({ message: 'Success', data: generatedQuiz }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
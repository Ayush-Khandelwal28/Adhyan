import { getSystemPrompt, getHumanPrompt } from "@/lib/prompts/quiz";
import { JsonParser } from "@/lib/jsonParser";
import { ExtractedQuizContent, Quiz, QuestionType, QuizQuestion } from "@/lib/types";
import { generateContent } from "@/lib/langchain/base";

export default async function generateQuizzes(
    type: QuestionType,
    content: ExtractedQuizContent,
    options?: {
        questionCount?: number;
        includeExplanations?: boolean;
        difficulty?: string;
    }
): Promise<Quiz> {
    const {
        questionCount = 10,
        includeExplanations = true,
        difficulty = 'Medium',
    } = options || {};

    const systemPrompt = getSystemPrompt(type, includeExplanations);
    const humanPrompt = getHumanPrompt(type, content, questionCount, includeExplanations, difficulty);

    // Select the appropriate parser based on type
    const parser = type === 'MCQ'
        ? JsonParser.parseMCQQuiz
        : JsonParser.parseTrueFalseQuiz;

    const questionsData = await generateContent<any[]>({
        systemPrompt,
        humanPrompt,
        parser,
        logLabel: `Quiz-${type}`
    });

    // Post-processing to ensure strictly typed return and any additional formatting
    const questions: QuizQuestion[] = questionsData.map((q) => {
        if (type === 'MCQ') {
            return {
                type: 'MCQ' as const,
                ...q,
                question: q.question,
                options: q.options
            };
        } else {
            return {
                type: 'TRUE_FALSE' as const,
                ...q,
                statement: q.statement,
                isTrue: q.isTrue
            };
        }
    });

    console.log("Generated questions:", questions.length);

    const quiz: Quiz = {
        title: `${content.title} - ${type === 'MCQ' ? 'Multiple Choice' : 'True/False'} Quiz`,
        questions,
        totalQuestions: questions.length,
    };

    return quiz;
}

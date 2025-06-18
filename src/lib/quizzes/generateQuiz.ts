import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { getSystemPrompt, getHumanPrompt } from "@/lib/quizzes/prompts";
import { JsonParser } from "@/lib/jsonParser";
import { ExtractedQuizContent, Quiz, QuestionType, QuizQuestion, MCQOption } from "@/lib/types";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

const llm = new ChatGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_API_KEY,
    model: "gemini-2.0-flash",
});

export default async function generateQuizzes(
    type: QuestionType,
    content: ExtractedQuizContent,
    options?: {
        questionCount?: number;
        includeExplanations?: boolean;
    }
): Promise<Quiz> {
    const {
        questionCount = 10,
        includeExplanations = true
    } = options || {};

    const systemPrompt = getSystemPrompt(type, includeExplanations);
    const humanPrompt = getHumanPrompt(type, content, questionCount, includeExplanations);

    const messages = [
        new SystemMessage({ content: systemPrompt }),
        new HumanMessage({ content: humanPrompt })
    ];

    const response = await llm.invoke(messages);

    if ("content" in response) {
        try {
            console.log("Response from Gemini:", response.content);
            const result = type === 'MCQ'
                ? JsonParser.parseMCQQuiz(response)
                : JsonParser.parseTrueFalseQuiz(response);

            if (result.error) {
                console.error("Error parsing JSON:", result.error);
                throw new Error(result.error);
            }

            if (!result.data) {
                throw new Error("No data returned from JSON parser");
            }

            const questions: QuizQuestion[] = result.data.map((q: {
                question?: string;
                statement?: string;
                options?: MCQOption[];
                isTrue?: boolean;
                explanation?: string;
            }) => {
                if (type === 'MCQ') {
                    return {
                        type: 'MCQ' as const,
                        ...q,
                        question: q.question!,
                        options: q.options!
                    };
                } else {
                    return {
                        type: 'TRUE_FALSE' as const,
                        ...q,
                        statement: q.statement!,
                        isTrue: q.isTrue!
                    };
                }
            });

            console.log("Generated questions:", questions);

            const quiz: Quiz = {
                title: `${content.title} - ${type === 'MCQ' ? 'Multiple Choice' : 'True/False'} Quiz`,
                questions,
                totalQuestions: questions.length,
            };

            return quiz;
        } catch (err) {
            console.error("Failed to parse JSON:", response.content);
            throw new Error("Invalid JSON returned from quiz generation");
        }
    }

    throw new Error("No quiz questions returned from Gemini.");
}
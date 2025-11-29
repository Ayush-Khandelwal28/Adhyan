import { getGeminiClient } from "./client";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { JsonParser } from "@/lib/jsonParser"
import { RecallContentItem, ApplicationContentItem, Flashcard } from "@/lib/types";
import { getFlashcardSystemPrompt, getFlashcardHumanPrompt } from "@/lib/prompts/flashcards";


type FlashcardType = 'recall' | 'application';

const llm = getGeminiClient();

export default async function generateFlashcards(
    type: FlashcardType,
    content: RecallContentItem[] | ApplicationContentItem[]
): Promise<Flashcard[]> {

    if (!content || content.length === 0) {
        console.log(`No ${type} content provided, returning empty array`);
        return [];
    }

    const formatted = content.map((item, i) => ({
        content: item.content,
        context: item.context ?? '',
        index: i,
    }));

    const messages = [
        new SystemMessage({
            content: getFlashcardSystemPrompt(type)
        }),
        new HumanMessage({
            content: getFlashcardHumanPrompt(type, formatted)
        })
    ];

    const response = await llm.invoke(messages);

    if ("content" in response) {
        try {
            console.log("For type:", type);
            console.log("Response from Gemini:", response.content);
            const result = JsonParser.parseFlashcards(response);
            console.log("Parse result:", JSON.stringify(result, null, 2));
            if (result.error) {
                console.error("Error parsing JSON:", result.error);
                throw new Error(result.error);
            }
            if (!result.data) {
                throw new Error("No data returned from JSON parser");
            }
            const flashcards: Flashcard[] = result.data.map(card => ({
                ...card,
                type
            }));
            return flashcards;
        } catch (error) {
            console.error("Failed to parse JSON:", response.content, error);
            throw new Error("Invalid JSON returned");
        }
    }

    throw new Error("No Flashcards returned from Gemini.");
}

import { RecallContentItem, ApplicationContentItem, Flashcard } from "@/lib/types";
import { getFlashcardSystemPrompt, getFlashcardHumanPrompt } from "@/lib/prompts/flashcards";
import { generateContent } from "./base";
import { JsonParser } from "@/lib/jsonParser";

type FlashcardType = 'recall' | 'application';

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

    const flashcards = await generateContent<Flashcard[]>({
        systemPrompt: getFlashcardSystemPrompt(type),
        humanPrompt: getFlashcardHumanPrompt(type, formatted),
        parser: JsonParser.parseFlashcards,
        logLabel: `Flashcards-${type}`
    });

    // Post-processing to add the type field if missing (though schema might handle it, it's safer to ensure)
    return flashcards.map(card => ({
        ...card,
        type
    }));
}

import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { JsonParser } from "@/lib/jsonParser"
import { RecallContentItem, ApplicationContentItem, Flashcard } from "@/lib/types";


type FlashcardType = 'recall' | 'application';

const llm = new ChatGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_API_KEY,
    model: "gemini-2.0-flash",
})

export default async function generateFlashcards(
    type: FlashcardType,
    content: RecallContentItem[] | ApplicationContentItem[]
): Promise<Flashcard[]> {
    const formatted = content.map((item, i) => ({
        content: item.content,
        context: item.context ?? '',
        index: i,
    }));

    const messages = [
        new SystemMessage({
            content: type === 'recall'
                ? "You are an expert at creating recall-based flashcards that test memory of key facts, definitions, and concepts."
                : "You are an expert at creating application-based flashcards that test understanding and relationships between concepts."
        }),
        new HumanMessage({
            content: `
Generate ${type} flashcards from the following content. Format as JSON array with "front" and "back" fields.

${type === 'recall'
                    ? 'Focus on testing recall of key facts, definitions, and main points.'
                    : 'Focus on testing application, analysis, and connections between concepts.'}

Content:
${JSON.stringify(formatted, null, 2)}

Return only the JSON array, no extra text.`
                .trim(),
        })
    ];

    const response = await llm.invoke(messages);

    if ("content" in response) {
        try {
            console.log("Response from Gemini:", response.content);
            const result = JsonParser.parseFlashcards(response);
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
        } catch (err) {
            console.error("Failed to parse JSON:", response.content);
            throw new Error("Invalid JSON returned");
        }
    }

    throw new Error("No Flashcards returned from Gemini.");
}

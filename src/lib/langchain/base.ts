import { getGeminiClient } from "./client";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { ParseResult } from "@/lib/types";

const llm = getGeminiClient();

interface GenerateContentParams<T> {
    systemPrompt: string;
    humanPrompt: string;
    parser: (response: any) => ParseResult<T>;
    logLabel?: string;
}

export async function generateContent<T>({
    systemPrompt,
    humanPrompt,
    parser,
    logLabel = "Content"
}: GenerateContentParams<T>): Promise<T> {
    const messages = [
        new SystemMessage({ content: systemPrompt }),
        new HumanMessage({ content: humanPrompt })
    ];

    try {
        const response = await llm.invoke(messages);

        if ("content" in response) {
            console.log(`[${logLabel}] Response received from Gemini`);

            const result = parser(response);

            if (result.error) {
                console.error(`[${logLabel}] Error parsing JSON:`, result.error);
                throw new Error(result.error);
            }

            if (!result.data) {
                throw new Error("No data returned from parser");
            }

            return result.data;
        }

        throw new Error(`[${logLabel}] No content returned from Gemini.`);
    } catch (error) {
        console.error(`[${logLabel}] Generation failed:`, error);
        throw error;
    }
}

import { getGeminiClient } from "./client";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { JsonParser } from "@/lib/jsonParser"
import { StudyNotesStructure } from "../types";
import { NOTES_SYSTEM_PROMPT, getNotesHumanPrompt } from "@/lib/prompts/notes";

const llm = getGeminiClient();

export async function generateStructuredNotes(fullContent: string): Promise<StudyNotesStructure> {
  const messages = [
    new SystemMessage(NOTES_SYSTEM_PROMPT),
    new HumanMessage(getNotesHumanPrompt(fullContent)),
  ];

  const response = await llm.invoke(messages);

  if ("content" in response) {
    try {
      console.log("Response from Gemini:", response.content);
      const result = JsonParser.parseStudyNotes(response);
      if (result.error) {
        console.error("Error parsing JSON:", result.error);
        throw new Error(result.error);
      }
      if (!result.data) {
        throw new Error("No data returned from JSON parser");
      }
      return result.data;
    } catch (error) {
      console.error("Failed to parse JSON:", response.content, error);
      throw new Error("Invalid JSON returned");
    }
  }

  throw new Error("No content returned from Gemini.");
}

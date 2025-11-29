import { getGeminiClient } from "./client";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { parseMindMap } from "@/lib/jsonParser"
import { StudyNotesStructure, MindMapStructure } from "@/lib/types";
import { MINDMAP_SYSTEM_PROMPT, getMindmapHumanPrompt } from "@/lib/prompts/mindmap";

const llm = getGeminiClient();

export default async function generateMindmap(
  content: StudyNotesStructure
): Promise<MindMapStructure> {

  const messages = [
    new SystemMessage({
      content: MINDMAP_SYSTEM_PROMPT
    }),
    new HumanMessage({
      content: getMindmapHumanPrompt(content)
    })
  ];

  const response = await llm.invoke(messages);

  if ("content" in response) {
    try {
      console.log("Response from Gemini:", response.content);
      const result = parseMindMap(response.content);
      if (!result.success || !result.data) {
        throw new Error(result.error || "Invalid mindmap structure returned");
      }
      return result.data;
    } catch (error) {
      console.error("Failed to parse JSON:", response.content, error);
      throw new Error("Invalid JSON returned");
    }
  }

  throw new Error("No mindmap returned from Gemini.");
}
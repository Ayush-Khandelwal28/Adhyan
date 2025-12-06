import { StudyNotesStructure, MindMapStructure } from "@/lib/types";
import { MINDMAP_SYSTEM_PROMPT, getMindmapHumanPrompt } from "@/lib/prompts/mindmap";
import { generateContent } from "./base";
import { JsonParser } from "@/lib/jsonParser";


export default async function generateMindmap(
  content: StudyNotesStructure
): Promise<MindMapStructure> {

  return generateContent<MindMapStructure>({
    systemPrompt: MINDMAP_SYSTEM_PROMPT,
    humanPrompt: getMindmapHumanPrompt(content),
    parser: JsonParser.parseMindMap,
    logLabel: "Mindmap"
  });
}
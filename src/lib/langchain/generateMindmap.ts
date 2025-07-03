import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { parseMindMap } from "@/lib/jsonParser"
import { StudyNotesStructure, MindMapStructure } from "@/lib/types";



const llm = new ChatGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY,
  model: "gemini-2.0-flash",
})

export default async function generateMindmap(
  content: StudyNotesStructure
): Promise<MindMapStructure> {

  const messages = [
    new SystemMessage({
      content: `You are an expert at creating educational mindmaps that help students visualize concepts and their relationships. 

Create mindmaps that:
- Have ONE central concept as the main topic
- Branch out into 3-6 main branches (themes/categories)
- Keep nodes concise (1-5 words max)
- Show relationships between concepts across different branches
- Use a maximum of 2-3 levels of hierarchy per branch
- Emphasize key concepts with appropriate emphasis levels

CRITICAL LABELING RULES:
- Use CONTENT-RICH labels that directly name what students are learning
- AVOID meta-labels like "Definition", "Types", "Classification", "Examples", "Properties"
- Instead of "Definition" → use the actual concept being defined
- Instead of "Types" → use the actual categories directly
- Instead of "Examples" → integrate examples as children of concepts
- Every label should answer "What am I learning?" not "What category is this?"

Structure requirements:
- central_concept: The main topic (derived from the title)
- branches: Major themes/sections from the content
- main_nodes: Key concepts under each branch (actual concepts, not meta-categories)
- children: Sub-concepts (max 2 levels deep)
- node_type: Use these three types strategically:
  * 'concept' for main ideas, principles, theories, or key topics
  * 'example' for specific instances, illustrations, or concrete cases
  * 'detail' for supporting information, elaborations, or additional context
- emphasis_level: 'high' for critical concepts, 'medium' for important, 'low' for supporting details`
    }),
    new HumanMessage({
      content: `
Create a mindmap from the following study notes. Extract the most important concepts and organize them in a radial, visual structure.

Focus on:
1. Identifying the central theme/concept
2. Creating logical branches for major topics
3. Breaking down complex points into atomic concepts
4. Using CONTENT-RICH labels - avoid meta-labels like "Definition", "Types", "Examples"
5. Using node types strategically:
   - 'concept': Main ideas, principles, theories (most common)
   - 'example': Specific instances, case studies, illustrations
   - 'detail': Supporting facts, elaborations, additional context
6. Prioritizing concepts by importance with emphasis levels

LABELING GUIDELINES:
❌ AVOID: "Definition", "Types", "Classification", "Examples", "Properties", "Characteristics"
✅ USE: Actual concept names, principle names, specific categories

BAD EXAMPLE:
{
  "label": "Definition",
  "children": [{"label": "Measurable quantity"}]
}

GOOD EXAMPLE:
{
  "label": "Physical Quantity",
  "children": [{"label": "Measurable", "node_type": "detail"}]
}

Required JSON structure:
{
  "central_concept": "Main Topic Title",
  "branches": [
    {
      "branch_label": "Major Theme 1",
      "main_nodes": [
        {
          "label": "Actual Concept Name",
          "node_type": "concept",
          "emphasis_level": "high",
          "children": [
            {
              "label": "Supporting Detail",
              "node_type": "detail",
              "emphasis_level": "medium"
            },
            {
              "label": "Specific Example",
              "node_type": "example",
              "emphasis_level": "low"
            }
          ]
        }
      ]
    }
  ]
}

Study Notes:
${JSON.stringify(content, null, 2)}

Return the result as a JSON object following the exact structure above.

Remember: Every label should directly tell students WHAT they're learning, not what category of information it is.

Return only the JSON object, no extra text.`
        .trim(),
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
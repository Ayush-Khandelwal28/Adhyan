import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { JsonParser } from "@/lib/jsonParser"
import { StudyNotesStructure } from "../types";

const llm = new ChatGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_API_KEY,
    model: "gemini-2.0-flash",
});

export async function generateStructuredNotes(fullContent: string): Promise<StudyNotesStructure> {
    const messages = [
        new SystemMessage(
            `You are an expert study assistant specializing in creating highly organized and comprehensive study notes. Your goal is to extract key information from provided content and structure it for effective learning and review.

## Instructions

Analyze the provided content and return study notes in the JSON format specified below. Focus on creating notes that facilitate active recall and spaced repetition learning techniques.

## Required JSON Format

json
{
  "title": "A concise and descriptive title for the notes, reflecting the main subject of the content.",
  "sections": [
    {
      "heading": "A clear, topic-specific heading for this section.",
      "points": [
        "A primary key concept, fact, or main idea from the content. Each point should be a concise, standalone statement that can be easily recalled.",
        "Include supporting details or elaborations under relevant points, maintaining clarity and specificity."
      ],
      "definitions": [
        "Key terms explicitly defined in the content, presented as 'Term: Definition'. Only include if a clear definition is present."
      ],
      "examples": [
        "Concrete examples illustrating concepts or points. Only include if explicitly provided or strongly implied by the content."
      ],
      "connections": [
        "Optional: Relationships between concepts within this section or links to other sections. Include only when explicitly stated or clearly implied."
      ],
      "subsections": [
        {
          "subheading": "A specific sub-topic within the main section.",
          "points": [
            "Key concepts, facts, or ideas specific to this subsection.",
            "Supporting details relevant to the sub-topic."
          ],
          "definitions": [
            "Key terms specific to this subsection, presented as 'Term: Definition'."
          ],
          "examples": [
            "Concrete examples illustrating concepts within this subsection."
          ],
          "connections": [
            "Optional: Relationships between concepts within this subsection or links to other parts of the content."
          ]
        }
      ]
    }
  ],
  "key_takeaways": [
    "The most important insights or conclusions from the entire content.",
    "Critical concepts that should be prioritized for memorization."
  ],
  "summary": "A brief, overarching summary of the entire content, capturing the main message and core learning objectives."
}
Guidelines
Content Fidelity:

Extract information exclusively from the provided content
Maintain the original meaning and context of all concepts
Use direct quotes when they enhance understanding, marked with quotation marks
Never add external knowledge or assumptions

Organization & Structure:

Arrange sections in logical order that follows the content's natural flow
Use subsections when content naturally divides into sub-topics within a main theme
Within sections and subsections, order points from general concepts to specific details
Group related concepts together for better comprehension
Ensure each section and subsection has a clear, focused theme
Create subsections only when there's substantial content that warrants subdivision

Clarity & Precision:

Write points as clear, actionable statements that facilitate review
Use specific terminology from the source material
Avoid vague language or overly general statements
Make each point independently understandable

Completeness:

Capture all significant concepts, arguments, facts, and details
Include quantitative data, dates, names, and specific information when present
Don't omit complex or challenging concepts
Preserve important nuances and qualifications

Conditional Elements:

Omit 'definitions', 'examples', or 'connections' arrays entirely if no relevant content exists for a section
Never include empty arrays or placeholder text
Only include 'connections' when relationships are explicitly stated or clearly implied

Output Requirements:

Return ONLY the JSON object with no additional text, commentary, or formatting
Ensure valid JSON syntax with proper escaping of quotes and special characters
Do not wrap the JSON in markdown code blocks or any other formatting
`
        ),
        new HumanMessage(
            `Create structured study notes in the specified JSON format based on the following content:\n\n${fullContent}`
        ),
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
        } catch (err) {
            console.error("Failed to parse JSON:", response.content);
            throw new Error("Invalid JSON returned");
        }
    }

    throw new Error("No content returned from Gemini.");
}

import { MindMapStructure, ParseResult, StudyNotesStructure, Flashcard, MCQQuestion, TrueFalseQuestion } from './types';
import {
  studyNotesSchema,
  flashcardArraySchema,
  mcqQuizSchema,
  trueFalseQuizSchema,
  mindMapSchema
} from './schemas';
import { z } from 'zod';

export class JsonParser {

  // Main method to parse and fix JSON from AI responses

  static parseAIResponse<T = any>(response: any, schema?: z.ZodType<T, any, any>): ParseResult<T> {
    try {
      // Extract content string from various response formats
      const contentString = this.extractContentString(response);

      if (!contentString) {
        return {
          success: false,
          error: "No content found in response",
          raw: JSON.stringify(response)
        };
      }

      // Clean and parse the JSON
      const parseResult = this.parseWithFixes<T>(contentString);

      if (!parseResult.success) {
        return parseResult;
      }

      // If schema is provided, validate against it
      if (schema) {
        const validation = schema.safeParse(parseResult.data);
        if (!validation.success) {
          return {
            success: false,
            error: `Validation failed: ${validation.error.message}`,
            data: parseResult.data,
            raw: contentString
          };
        }
        return {
          success: true,
          data: validation.data,
          fixes_applied: parseResult.fixes_applied
        };
      }

      return parseResult;

    } catch (error) {
      return {
        success: false,
        error: `Unexpected error: ${error instanceof Error ? error.message : String(error)}`,
        raw: JSON.stringify(response)
      };
    }
  }


  // Extract content string from various response formats

  private static extractContentString(response: any): string {
    if (typeof response === 'string') {
      return response;
    }

    if ("content" in response) {
      return String(response.content);
    }

    if ("text" in response) {
      return String(response.text);
    }

    if ("message" in response) {
      return String(response.message);
    }

    return String(response);
  }


  // Parse JSON with progressive fixes

  private static parseWithFixes<T>(content: string): ParseResult<T> {
    const fixes: string[] = [];
    let cleanedContent = content;

    try {
      // First attempt - try parsing as-is
      return {
        success: true,
        data: JSON.parse(cleanedContent),
        fixes_applied: fixes
      };
    } catch {
      // Apply fixes progressively
      cleanedContent = this.removeMarkdownFormatting(cleanedContent);
      if (cleanedContent !== content) fixes.push("Removed markdown formatting");

      try {
        return {
          success: true,
          data: JSON.parse(cleanedContent),
          fixes_applied: fixes
        };
      } catch {
        cleanedContent = this.extractJsonFromText(cleanedContent);
        if (cleanedContent !== content) fixes.push("Extracted JSON from text");

        try {
          return {
            success: true,
            data: JSON.parse(cleanedContent),
            fixes_applied: fixes
          };
        } catch {
          cleanedContent = this.fixCommonJsonErrors(cleanedContent);
          fixes.push("Fixed common JSON syntax errors");

          try {
            return {
              success: true,
              data: JSON.parse(cleanedContent),
              fixes_applied: fixes
            };
          } catch {
            // Final attempt with aggressive fixes
            cleanedContent = this.aggressiveJsonFix(cleanedContent);
            fixes.push("Applied aggressive JSON fixes");

            try {
              return {
                success: true,
                data: JSON.parse(cleanedContent),
                fixes_applied: fixes
              };
            } catch (finalError) {
              return {
                success: false,
                error: `JSON parsing failed after all fixes: ${finalError instanceof Error ? finalError.message : String(finalError)}`,
                raw: content,
                fixes_applied: fixes
              };
            }
          }
        }
      }
    }
  }


  // Remove markdown code block formatting

  private static removeMarkdownFormatting(content: string): string {
    return content
      // Remove ```json and ``` blocks
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/gm, '')
      .replace(/```\s*$/gm, '')
      // Remove other markdown formatting
      .replace(/^\s*```.*$/gm, '')
      .trim();
  }


  // Extract JSON object from text that may contain extra content

  private static extractJsonFromText(content: string): string {
    // Look for JSON object boundaries
    const jsonStart = content.indexOf('{');
    const jsonEnd = content.lastIndexOf('}');

    if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
      return content.substring(jsonStart, jsonEnd + 1);
    }

    // Look for JSON array boundaries if no object found
    const arrayStart = content.indexOf('[');
    const arrayEnd = content.lastIndexOf(']');

    if (arrayStart !== -1 && arrayEnd !== -1 && arrayEnd > arrayStart) {
      return content.substring(arrayStart, arrayEnd + 1);
    }

    return content;
  }


  // Fix common JSON syntax errors

  private static fixCommonJsonErrors(content: string): string {
    return content
      // Fix trailing commas
      .replace(/,(\s*[}\]])/g, '$1')
      // Fix missing commas between objects/arrays
      .replace(/}(\s*){/g, '},$1{')
      .replace(/](\s*)\[/g, '],$1[')
      // Fix unescaped quotes in strings
      .replace(/"([^"]*)"([^"]*)"([^"]*)":/g, '"$1\\"$2\\"$3":')
      // Fix single quotes (convert to double quotes)
      .replace(/'/g, '"')
      // Remove any non-printable characters
      .replace(/[\x00-\x1F\x7F]/g, '')
      // Fix newlines in strings
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '\\r')
      .replace(/\t/g, '\\t');
  }


  // Aggressive JSON fixes as last resort

  private static aggressiveJsonFix(content: string): string {
    try {
      // Remove any text before first { or [ and after last } or ]
      const firstBrace = content.indexOf('{');
      const firstBracket = content.indexOf('[');
      const lastBrace = content.lastIndexOf('}');
      const lastBracket = content.lastIndexOf(']');

      let start = -1;
      let end = -1;

      // Determine if we're dealing with an object or array
      if (firstBrace !== -1 && (firstBracket === -1 || firstBrace < firstBracket)) {
        start = firstBrace;
        end = lastBrace;
      } else if (firstBracket !== -1) {
        start = firstBracket;
        end = lastBracket;
      }

      if (start === -1 || end === -1) {
        throw new Error('No JSON structure found');
      }

      let jsonContent = content.substring(start, end + 1);

      // Balance braces
      jsonContent = this.balanceBraces(jsonContent);

      // Fix array structures
      jsonContent = this.fixArrayStructures(jsonContent);

      return jsonContent;
    } catch {
      return content;
    }
  }


  // Balance braces and brackets

  private static balanceBraces(content: string): string {
    const stack: string[] = [];
    let result = '';

    for (let i = 0; i < content.length; i++) {
      const char = content[i];

      if (char === '{' || char === '[') {
        stack.push(char);
        result += char;
      } else if (char === '}' || char === ']') {
        const expected = char === '}' ? '{' : '[';
        if (stack.length > 0 && stack[stack.length - 1] === expected) {
          stack.pop();
          result += char;
        }
        // Skip unmatched closing braces
      } else {
        result += char;
      }
    }

    // Add missing closing braces
    while (stack.length > 0) {
      const open = stack.pop();
      result += open === '{' ? '}' : ']';
    }

    return result;
  }


  // Fix array structures

  private static fixArrayStructures(content: string): string {
    return content
      // Ensure arrays have proper comma separation
      .replace(/"\s*\n\s*"/g, '",\n    "')
      // Fix missing array brackets for main section fields
      .replace(/"points":\s*"([^"]+)"/g, '"points": ["$1"]')
      .replace(/"definitions":\s*"([^"]+)"/g, '"definitions": ["$1"]')
      .replace(/"examples":\s*"([^"]+)"/g, '"examples": ["$1"]')
      .replace(/"connections":\s*"([^"]+)"/g, '"connections": ["$1"]')
      .replace(/"key_takeaways":\s*"([^"]+)"/g, '"key_takeaways": ["$1"]')
      // Fix missing array brackets for subsection fields
      .replace(/"subheading":\s*\[([^\]]+)\]/g, '"subheading": "$1"') // Fix incorrect array for subheading
      .replace(/("subsections":\s*\[[\s\S]*?)"points":\s*"([^"]+)"/g, '$1"points": ["$2"]')
      .replace(/("subsections":\s*\[[\s\S]*?)"definitions":\s*"([^"]+)"/g, '$1"definitions": ["$2"]')
      .replace(/("subsections":\s*\[[\s\S]*?)"examples":\s*"([^"]+)"/g, '$1"examples": ["$2"]')
      .replace(/("subsections":\s*\[[\s\S]*?)"connections":\s*"([^"]+)"/g, '$1"connections": ["$2"]');
  }


  // Convenience methods using Zod schemas

  static parseFlashcards(response: any): ParseResult<Flashcard[]> {
    return JsonParser.parseAIResponse<Flashcard[]>(response, flashcardArraySchema);
  }

  static parseStudyNotes(response: any): ParseResult<StudyNotesStructure> {
    return JsonParser.parseAIResponse<StudyNotesStructure>(response, studyNotesSchema);
  }

  static parseMindMap(response: any): ParseResult<MindMapStructure> {
    return JsonParser.parseAIResponse<MindMapStructure>(response, mindMapSchema);
  }

  static parseMCQQuiz(response: any): ParseResult<MCQQuestion[]> {
    return JsonParser.parseAIResponse<MCQQuestion[]>(response, mcqQuizSchema);
  }

  static parseTrueFalseQuiz(response: any): ParseResult<TrueFalseQuestion[]> {
    return JsonParser.parseAIResponse<TrueFalseQuestion[]>(response, trueFalseQuizSchema);
  }

  // Legacy structure validators (can be deprecated or removed if no longer used directly)
  static validateStudyNotesStructure(data: any): ParseResult<StudyNotesStructure> {
    const validation = studyNotesSchema.safeParse(data);
    return validation.success
      ? { success: true, data: validation.data }
      : { success: false, error: validation.error.message, data: data };
  }

  static validateFlashcardsStructure(data: any): ParseResult<Flashcard[]> {
    const validation = flashcardArraySchema.safeParse(data);
    return validation.success
      ? { success: true, data: validation.data }
      : { success: false, error: validation.error.message, data: data };
  }

  static validateMCQQuizStructure(data: any): ParseResult<MCQQuestion[]> {
    const validation = mcqQuizSchema.safeParse(data);
    return validation.success
      ? { success: true, data: validation.data }
      : { success: false, error: validation.error.message, data: data };
  }

  static validateTrueFalseQuizStructure(data: any): ParseResult<TrueFalseQuestion[]> {
    const validation = trueFalseQuizSchema.safeParse(data);
    return validation.success
      ? { success: true, data: validation.data }
      : { success: false, error: validation.error.message, data: data };
  }

  static validateMindMapStructure(data: any): ParseResult<MindMapStructure> {
    const validation = mindMapSchema.safeParse(data);
    return validation.success
      ? { success: true, data: validation.data }
      : { success: false, error: validation.error.message, data: data };
  }
}

// Export convenience functions as bound methods
export const parseAIResponse = JsonParser.parseAIResponse.bind(JsonParser);
export const parseStudyNotes = JsonParser.parseStudyNotes.bind(JsonParser);
export const parseFlashcards = JsonParser.parseFlashcards.bind(JsonParser);
export const parseMCQQuiz = JsonParser.parseMCQQuiz.bind(JsonParser);
export const parseTrueFalseQuiz = JsonParser.parseTrueFalseQuiz.bind(JsonParser);
export const validateStudyNotesStructure = JsonParser.validateStudyNotesStructure.bind(JsonParser);
export const validateFlashcardsStructure = JsonParser.validateFlashcardsStructure.bind(JsonParser);
export const validateMCQQuizStructure = JsonParser.validateMCQQuizStructure.bind(JsonParser);
export const validateTrueFalseQuizStructure = JsonParser.validateTrueFalseQuizStructure.bind(JsonParser);
export const parseMindMap = JsonParser.parseMindMap.bind(JsonParser);

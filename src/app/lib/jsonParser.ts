import { StudyNotesStructure, ParseResult, Flashcard  } from '@/app/lib/types'

interface FlashcardParsing {
  front: string;
  back: string;
}

export class JsonParser {
  /**
   * Main method to parse and fix JSON from AI responses
   */
  static parseAIResponse<T = any>(response: any): ParseResult<T> {
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
      return parseResult;

    } catch (error) {
      return {
        success: false,
        error: `Unexpected error: ${error instanceof Error ? error.message : String(error)}`,
        raw: JSON.stringify(response)
      };
    }
  }

  /**
   * Extract content string from various response formats
   */
  private static extractContentString(response: any): string {
    if (typeof response === 'string') {
      return response;
    }

    if ("content" in response) {
      if (Array.isArray(response.content)) {
        interface ContentItem {
            text?: string;
            [key: string]: any;
        }
      }
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

  /**
   * Parse JSON with progressive fixes
   */
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
    } catch (error) {
      // Apply fixes progressively
      cleanedContent = this.removeMarkdownFormatting(cleanedContent);
      if (cleanedContent !== content) fixes.push("Removed markdown formatting");

      try {
        return {
          success: true,
          data: JSON.parse(cleanedContent),
          fixes_applied: fixes
        };
      } catch (error) {
        cleanedContent = this.extractJsonFromText(cleanedContent);
        if (cleanedContent !== content) fixes.push("Extracted JSON from text");

        try {
          return {
            success: true,
            data: JSON.parse(cleanedContent),
            fixes_applied: fixes
          };
        } catch (error) {
          cleanedContent = this.fixCommonJsonErrors(cleanedContent);
          fixes.push("Fixed common JSON syntax errors");

          try {
            return {
              success: true,
              data: JSON.parse(cleanedContent),
              fixes_applied: fixes
            };
          } catch (error) {
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

  /**
   * Remove markdown code block formatting
   */
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

  /**
   * Extract JSON object from text that may contain extra content
   */
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

  /**
   * Fix common JSON syntax errors
   */
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

  /**
   * Aggressive JSON fixes as last resort
   */
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
    } catch (error) {
      return content;
    }
  }

  /**
   * Balance braces and brackets
   */
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

  /**
   * Fix array structures
   */
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

  /**
   * Validate flashcard structure
   */
  private static validateFlashcard(flashcard: any, index: number): string[] {
    const errors: string[] = [];
    
    if (!flashcard || typeof flashcard !== 'object') {
      errors.push(`Flashcard ${index}: Must be an object`);
      return errors;
    }
    
    if (!flashcard.front || typeof flashcard.front !== 'string') {
      errors.push(`Flashcard ${index}: Missing or invalid 'front' field`);
    }
    
    if (!flashcard.back || typeof flashcard.back !== 'string') {
      errors.push(`Flashcard ${index}: Missing or invalid 'back' field`);
    }
    
    // Check for empty strings
    if (flashcard.front && flashcard.front.trim().length === 0) {
      errors.push(`Flashcard ${index}: 'front' field cannot be empty`);
    }
    
    if (flashcard.back && flashcard.back.trim().length === 0) {
      errors.push(`Flashcard ${index}: 'back' field cannot be empty`);
    }
    
    return errors;
  }

  /**
   * Validate flashcards array structure
   */
  static validateFlashcardsStructure(data: any): ParseResult<FlashcardParsing[]> {
    try {
      const errors: string[] = [];
      
      if (!Array.isArray(data)) {
        errors.push('Data must be an array of flashcards');
        return {
          success: false,
          error: errors.join(', '),
          data: data
        };
      }
      
      if (data.length === 0) {
        errors.push('Flashcards array cannot be empty');
      }
      
      data.forEach((flashcard: any, index: number) => {
        const flashcardErrors = this.validateFlashcard(flashcard, index);
        errors.push(...flashcardErrors);
      });
      
      if (errors.length > 0) {
        return {
          success: false,
          error: `Validation failed: ${errors.join(', ')}`,
          data: data
        };
      }
      
      return {
        success: true,
        data: data as FlashcardParsing[]
      };
    } catch (error) {
      return {
        success: false,
        error: `Validation error: ${error instanceof Error ? error.message : String(error)}`,
        data: data
      };
    }
  }

  /**
   * Convenience method specifically for flashcards
   */
  static parseFlashcards(response: any): ParseResult<FlashcardParsing[]> {
    const parseResult = this.parseAIResponse<FlashcardParsing[]>(response);
    
    if (!parseResult.success) {
      return parseResult;
    }
    
    return this.validateFlashcardsStructure(parseResult.data);
  }

  /**
   * Validate subsection structure
   */
  private static validateSubsection(subsection: any, sectionIndex: number, subsectionIndex: number): string[] {
    const errors: string[] = [];
    
    if (!subsection.subheading || typeof subsection.subheading !== 'string') {
      errors.push(`Section ${sectionIndex}, Subsection ${subsectionIndex}: Missing or invalid subheading`);
    }
    
    if (!subsection.points || !Array.isArray(subsection.points)) {
      errors.push(`Section ${sectionIndex}, Subsection ${subsectionIndex}: Missing or invalid points array`);
    }
    
    // Optional arrays should be arrays if they exist
    ['definitions', 'examples', 'connections'].forEach(field => {
      if (subsection[field] !== undefined && !Array.isArray(subsection[field])) {
        errors.push(`Section ${sectionIndex}, Subsection ${subsectionIndex}: ${field} must be an array if present`);
      }
    });
    
    return errors;
  }

  /**
   * Validate study notes structure specifically
   */
  static validateStudyNotesStructure(data: any): ParseResult<StudyNotesStructure> {
    try {
      const errors: string[] = [];
      
      if (!data || typeof data !== 'object') {
        errors.push('Data must be an object');
      }
      
      if (!data.title || typeof data.title !== 'string') {
        errors.push('Missing or invalid title');
      }
      
      if (!data.sections || !Array.isArray(data.sections)) {
        errors.push('Missing or invalid sections array');
      } else {
        data.sections.forEach((section: any, index: number) => {
          if (!section.heading || typeof section.heading !== 'string') {
            errors.push(`Section ${index}: Missing or invalid heading`);
          }
          if (!section.points || !Array.isArray(section.points)) {
            errors.push(`Section ${index}: Missing or invalid points array`);
          }
          
          // Validate optional arrays
          ['definitions', 'examples', 'connections'].forEach(field => {
            if (section[field] !== undefined && !Array.isArray(section[field])) {
              errors.push(`Section ${index}: ${field} must be an array if present`);
            }
          });
          
          // Validate subsections if they exist
          if (section.subsections !== undefined) {
            if (!Array.isArray(section.subsections)) {
              errors.push(`Section ${index}: subsections must be an array if present`);
            } else {
              section.subsections.forEach((subsection: any, subIndex: number) => {
                const subsectionErrors = this.validateSubsection(subsection, index, subIndex);
                errors.push(...subsectionErrors);
              });
            }
          }
        });
      }
      
      if (!data.summary || typeof data.summary !== 'string') {
        errors.push('Missing or invalid summary');
      }
      
      // Validate optional key_takeaways
      if (data.key_takeaways !== undefined && !Array.isArray(data.key_takeaways)) {
        errors.push('key_takeaways must be an array if present');
      }
      
      if (errors.length > 0) {
        return {
          success: false,
          error: `Validation failed: ${errors.join(', ')}`,
          data: data
        };
      }
      
      return {
        success: true,
        data: data as StudyNotesStructure
      };
    } catch (error) {
      return {
        success: false,
        error: `Validation error: ${error instanceof Error ? error.message : String(error)}`,
        data: data
      };
    }
  }

  /**
   * Convenience method specifically for study notes
   */
  static parseStudyNotes(response: any): ParseResult<StudyNotesStructure> {
    const parseResult = this.parseAIResponse<StudyNotesStructure>(response);
    
    if (!parseResult.success) {
      return parseResult;
    }
    
    return this.validateStudyNotesStructure(parseResult.data);
  }
}

// Export convenience functions
export const parseAIResponse = JsonParser.parseAIResponse;
export const parseStudyNotes = JsonParser.parseStudyNotes;
export const parseFlashcards = JsonParser.parseFlashcards;
export const validateStudyNotesStructure = JsonParser.validateStudyNotesStructure;
export const validateFlashcardsStructure = JsonParser.validateFlashcardsStructure;
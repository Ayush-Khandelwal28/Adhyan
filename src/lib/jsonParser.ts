import { MindMapStructure, ParseResult, StudyNotesStructure, Flashcard, MCQQuestion, TrueFalseQuestion } from './types';

export class JsonParser {

  // Main method to parse and fix JSON from AI responses

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


  // Validate flashcard structure

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


  // Validate flashcards array structure

  static validateFlashcardsStructure(data: any): ParseResult<Flashcard[]> {
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
        data: data as Flashcard[]
      };
    } catch (error) {
      return {
        success: false,
        error: `Validation error: ${error instanceof Error ? error.message : String(error)}`,
        data: data
      };
    }
  }


  // Convenience method specifically for flashcards

  static parseFlashcards(response: any): ParseResult<Flashcard[]> {
    const parseResult = this.parseAIResponse<Flashcard[]>(response);

    if (!parseResult.success) {
      return parseResult;
    }

    return this.validateFlashcardsStructure(parseResult.data);
  }


  // Validate subsection structure

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


  // Validate study notes structure specifically

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


  // Convenience method specifically for study notes

  static parseStudyNotes(response: any): ParseResult<StudyNotesStructure> {
    const parseResult = this.parseAIResponse<StudyNotesStructure>(response);

    if (!parseResult.success) {
      return parseResult;
    }

    return this.validateStudyNotesStructure(parseResult.data);
  }



  // Validate MCQ option structure

  private static validateMCQOption(option: any, questionIndex: number, optionIndex: number): string[] {
    const errors: string[] = [];

    if (!option || typeof option !== 'object') {
      errors.push(`Question ${questionIndex}, Option ${optionIndex}: Must be an object`);
      return errors;
    }

    if (!option.text || typeof option.text !== 'string') {
      errors.push(`Question ${questionIndex}, Option ${optionIndex}: Missing or invalid 'text' field`);
    }

    if (typeof option.isCorrect !== 'boolean') {
      errors.push(`Question ${questionIndex}, Option ${optionIndex}: Missing or invalid 'isCorrect' field (must be boolean)`);
    }

    if (option.text && option.text.trim().length === 0) {
      errors.push(`Question ${questionIndex}, Option ${optionIndex}: 'text' field cannot be empty`);
    }

    return errors;
  }


  // Validate MCQ question structure

  private static validateMCQQuestion(question: any, index: number): string[] {
    const errors: string[] = [];

    if (!question || typeof question !== 'object') {
      errors.push(`Question ${index}: Must be an object`);
      return errors;
    }

    if (!question.question || typeof question.question !== 'string') {
      errors.push(`Question ${index}: Missing or invalid 'question' field`);
    }

    if (!question.options || !Array.isArray(question.options)) {
      errors.push(`Question ${index}: Missing or invalid 'options' array`);
    } else {
      // Check for exactly 4 options
      if (question.options.length !== 4) {
        errors.push(`Question ${index}: Must have exactly 4 options, found ${question.options.length}`);
      }

      // Validate each option
      question.options.forEach((option: any, optionIndex: number) => {
        const optionErrors = this.validateMCQOption(option, index, optionIndex);
        errors.push(...optionErrors);
      });

      // Check for exactly one correct answer
      const correctOptions = question.options.filter((opt: any) => opt.isCorrect === true);
      if (correctOptions.length !== 1) {
        errors.push(`Question ${index}: Must have exactly 1 correct answer, found ${correctOptions.length}`);
      }
    }

    // Validate optional fields
    if (question.explanation !== undefined && typeof question.explanation !== 'string') {
      errors.push(`Question ${index}: 'explanation' must be a string if provided`);
    }

    // Check for empty question text
    if (question.question && question.question.trim().length === 0) {
      errors.push(`Question ${index}: 'question' field cannot be empty`);
    }

    return errors;
  }


  // Validate True/False question structure

  private static validateTrueFalseQuestion(question: any, index: number): string[] {
    const errors: string[] = [];

    if (!question || typeof question !== 'object') {
      errors.push(`Question ${index}: Must be an object`);
      return errors;
    }

    if (!question.statement || typeof question.statement !== 'string') {
      errors.push(`Question ${index}: Missing or invalid 'statement' field`);
    }

    if (typeof question.isTrue !== 'boolean') {
      errors.push(`Question ${index}: Missing or invalid 'isTrue' field (must be boolean)`);
    }

    // Validate optional fields
    if (question.explanation !== undefined && typeof question.explanation !== 'string') {
      errors.push(`Question ${index}: 'explanation' must be a string if provided`);
    }

    // Check for empty statement
    if (question.statement && question.statement.trim().length === 0) {
      errors.push(`Question ${index}: 'statement' field cannot be empty`);
    }

    return errors;
  }


  // Validate MCQ quiz structure

  static validateMCQQuizStructure(data: any): ParseResult<MCQQuestion[]> {
    try {
      const errors: string[] = [];

      if (!Array.isArray(data)) {
        errors.push('Data must be an array of MCQ questions');
        return {
          success: false,
          error: errors.join(', '),
          data: data
        };
      }

      if (data.length === 0) {
        errors.push('MCQ questions array cannot be empty');
      }

      data.forEach((question: any, index: number) => {
        const questionErrors = this.validateMCQQuestion(question, index);
        errors.push(...questionErrors);
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
        data: data as MCQQuestion[]
      };
    } catch (error) {
      return {
        success: false,
        error: `Validation error: ${error instanceof Error ? error.message : String(error)}`,
        data: data
      };
    }
  }


  // Validate True/False quiz structure

  static validateTrueFalseQuizStructure(data: any): ParseResult<TrueFalseQuestion[]> {
    try {
      const errors: string[] = [];

      if (!Array.isArray(data)) {
        errors.push('Data must be an array of True/False questions');
        return {
          success: false,
          error: errors.join(', '),
          data: data
        };
      }

      if (data.length === 0) {
        errors.push('True/False questions array cannot be empty');
      }

      // Check for balanced true/false distribution (warn if very unbalanced)
      const trueQuestions = data.filter((q: any) => q.isTrue === true);
      const falseQuestions = data.filter((q: any) => q.isTrue === false);
      const ratio = trueQuestions.length / data.length;

      if (ratio < 0.2 || ratio > 0.8) {
        console.warn(`Unbalanced True/False distribution: ${trueQuestions.length} true, ${falseQuestions.length} false`);
      }

      data.forEach((question: any, index: number) => {
        const questionErrors = this.validateTrueFalseQuestion(question, index);
        errors.push(...questionErrors);
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
        data: data as TrueFalseQuestion[]
      };
    } catch (error) {
      return {
        success: false,
        error: `Validation error: ${error instanceof Error ? error.message : String(error)}`,
        data: data
      };
    }
  }


  // Validate node structure

  private static validateNode(node: any, index: number, parentContext: string): string[] {
    const errors: string[] = [];

    if (!node || typeof node !== 'object') {
      errors.push(`${parentContext}, Node ${index}: Must be an object`);
      return errors;
    }

    if (!node.label || typeof node.label !== 'string') {
      errors.push(`${parentContext}, Node ${index}: Missing or invalid 'label' field`);
    }

    if (!node.node_type || typeof node.node_type !== 'string' ||
      !['concept', 'detail', 'example'].includes(node.node_type)) {
      errors.push(`${parentContext}, Node ${index}: Invalid 'node_type' field (must be 'concept', 'detail', or 'example')`);
    }

    if (!node.emphasis_level || typeof node.emphasis_level !== 'string' ||
      !['high', 'medium', 'low'].includes(node.emphasis_level)) {
      errors.push(`${parentContext}, Node ${index}: Invalid 'emphasis_level' field (must be 'high', 'medium', or 'low')`);
    }

    // Validate children if they exist
    if (node.children !== undefined) {
      if (!Array.isArray(node.children)) {
        errors.push(`${parentContext}, Node ${index}: children must be an array if present`);
      } else {
        node.children.forEach((child: any, childIndex: number) => {
          const childErrors = this.validateNode(child, childIndex, `${parentContext}, Node ${index}`);
          errors.push(...childErrors);
        });
      }
    }

    return errors;
  }


  // Validate branch structure

  private static validateBranch(branch: any, index: number): string[] {
    const errors: string[] = [];

    if (!branch || typeof branch !== 'object') {
      errors.push(`Branch ${index}: Must be an object`);
      return errors;
    }

    if (!branch.branch_label || typeof branch.branch_label !== 'string') {
      errors.push(`Branch ${index}: Missing or invalid 'branch_label' field`);
    }

    if (!branch.main_nodes || !Array.isArray(branch.main_nodes)) {
      errors.push(`Branch ${index}: Missing or invalid 'main_nodes' array`);
    } else {
      branch.main_nodes.forEach((node: any, nodeIndex: number) => {
        const nodeErrors = this.validateNode(node, nodeIndex, `Branch ${index}`);
        errors.push(...nodeErrors);
      });
    }

    return errors;
  }


  // Validate mind map structure

  static validateMindMapStructure(data: any): ParseResult<MindMapStructure> {
    try {
      const errors: string[] = [];

      if (!data || typeof data !== 'object') {
        errors.push('Data must be an object');
        return {
          success: false,
          error: errors.join(', '),
          data: data
        };
      }

      if (!data.central_concept || typeof data.central_concept !== 'string') {
        errors.push('Missing or invalid central_concept');
      }

      if (!data.branches || !Array.isArray(data.branches)) {
        errors.push('Missing or invalid branches array');
      } else {
        data.branches.forEach((branch: any, index: number) => {
          const branchErrors = this.validateBranch(branch, index);
          errors.push(...branchErrors);
        });
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
        data: data as MindMapStructure
      };
    } catch (error) {
      return {
        success: false,
        error: `Validation error: ${error instanceof Error ? error.message : String(error)}`,
        data: data
      };
    }
  }


  // Convenience method specifically for mind maps

  static parseMindMap(response: any): ParseResult<MindMapStructure> {
    const parseResult = this.parseAIResponse<MindMapStructure>(response);

    if (!parseResult.success) {
      return parseResult;
    }

    return this.validateMindMapStructure(parseResult.data);
  }


  // Convenience method specifically for MCQ quizzes

  static parseMCQQuiz(response: any): ParseResult<MCQQuestion[]> {
    const parseResult = this.parseAIResponse<MCQQuestion[]>(response);

    if (!parseResult.success) {
      return parseResult;
    }

    return this.validateMCQQuizStructure(parseResult.data);
  }


  // Convenience method specifically for True/False quizzes

  static parseTrueFalseQuiz(response: any): ParseResult<TrueFalseQuestion[]> {
    const parseResult = this.parseAIResponse<TrueFalseQuestion[]>(response);

    if (!parseResult.success) {
      return parseResult;
    }

    return this.validateTrueFalseQuizStructure(parseResult.data);
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
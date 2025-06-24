
import {QuestionType, ExtractedQuizContent} from "@/lib/types";

export function getSystemPrompt(type: QuestionType, includeExplanations: boolean): string {
  const basePrompt = type === 'MCQ'
    ? `You are an expert at creating high-quality multiple-choice questions for educational assessment. 

Your MCQ questions should:
- Have exactly 4 options (A, B, C, D)
- Have only ONE correct answer
- Include plausible distractors (wrong answers that seem reasonable)
- Test understanding, not just memorization
- Be clear and unambiguous
- Avoid "all of the above" or "none of the above" options
- Use parallel structure in all options`

    : `You are an expert at creating high-quality True/False questions for educational assessment.

Your True/False questions should:
- Present clear, unambiguous statements
- Test specific facts or concepts
- Avoid trick questions or overly complex statements
- Include both true and false statements in balanced proportions
- Focus on important concepts, not trivial details`;

  if (includeExplanations) {
    return basePrompt + `\n\nAlways provide brief explanations for why the answer is correct.`;
  }

  return basePrompt;
}

export function getHumanPrompt(
  type: QuestionType,
  content: ExtractedQuizContent,
  questionCount: number,
  includeExplanations: boolean,
  difficulty?: string
): string {
  const contentSummary = getContentSummary(content);
  
  const formatInstructions = type === 'MCQ' ? getMCQFormatInstructions() : getTrueFalseFormatInstructions();

  return `
Generate ${questionCount} ${type === 'MCQ' ? 'multiple-choice' : 'true/false'} questions of difficulty ${difficulty} from the following study content.

CONTENT TO CREATE QUESTIONS FROM:
${contentSummary}

DISTRIBUTION GUIDELINES:
- Create questions covering different sections proportionally
- Mix question categories: definitions (25%), concepts (50%), applications (25%)
- Ensure good coverage of the most important points
${includeExplanations ? '- Include brief explanations for each answer' : ''}

${formatInstructions}

Return only the JSON array, no extra text or markdown.`.trim();
}

function getContentSummary(content: ExtractedQuizContent): string {
  let summary = `Title: ${content.title}\nSummary: ${content.summary}\n\nSECTIONS:\n`;
  
  content.extractedSections.forEach((section, index) => {
    summary += `\n${index + 1}. ${section.heading}${section.parentHeading ? ` (under ${section.parentHeading})` : ''}\n`;
    
    if (section.points.length > 0) {
      summary += `   Key Points:\n`;
      section.points.forEach(point => summary += `   - ${point}\n`);
    }
    
    if (section.definitions.length > 0) {
      summary += `   Definitions:\n`;
      section.definitions.forEach(def => summary += `   - ${def}\n`);
    }
    
    if (section.examples.length > 0) {
      summary += `   Examples:\n`;
      section.examples.forEach(ex => summary += `   - ${ex}\n`);
    }
  });
  
  return summary;
}

function getMCQFormatInstructions(): string {
  return `
FORMAT REQUIREMENTS:
Return a JSON array where each question follows this exact structure:
[
  {
    "question": "Clear, specific question text ending with a question mark?",
    "options": [
      { "text": "Option A text", "isCorrect": false },
      { "text": "Option B text", "isCorrect": true },
      { "text": "Option C text", "isCorrect": false },
      { "text": "Option D text", "isCorrect": false }
    ],
    "explanation": "Brief explanation of why the correct answer is right",
  }
]

CRITICAL: Ensure exactly one option has "isCorrect": true, all others must be false.`;
}

function getTrueFalseFormatInstructions(): string {
  return `
FORMAT REQUIREMENTS:
Return a JSON array where each question follows this exact structure:
[
  {
    "statement": "Clear, factual statement to evaluate (no question mark)",
    "isTrue": true,
    "explanation": "Brief explanation of why this statement is true/false",
  }
]

CRITICAL: Mix both true and false statements. Aim for roughly 50/50 distribution.`;
}
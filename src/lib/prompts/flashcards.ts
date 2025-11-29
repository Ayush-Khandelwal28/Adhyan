export const getFlashcardSystemPrompt = (type: 'recall' | 'application') =>
    type === 'recall'
        ? "You are an expert at creating recall-based flashcards that test memory of key facts, definitions, and concepts."
        : "You are an expert at creating application-based flashcards that test understanding and relationships between concepts.";

export const getFlashcardHumanPrompt = (type: 'recall' | 'application', formattedContent: any[]) => `
Generate ${type} flashcards from the following content. Format as JSON array with "front" and "back" fields.

${type === 'recall'
        ? 'Focus on testing recall of key facts, definitions, and main points.'
        : 'Focus on testing application, analysis, and connections between concepts.'}

Content:
${JSON.stringify(formattedContent, null, 2)}

Return only the JSON array, no extra text.`.trim();

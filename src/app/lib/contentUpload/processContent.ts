import { extractText, getDocumentProxy } from 'unpdf'

interface ChunkingOptions {
    preserveSentences?: boolean;
    minChunkSize?: number;
    maxChunkSize?: number;
}

export function prepareTextForChunking(
    text: string,
    options?: ChunkingOptions
): string[] {
    const {
        preserveSentences = true,
        minChunkSize = 100,
        maxChunkSize = 1000
    } = options || {};

    // Clean the text before processing
    text = cleanTextForChunking(text);
    if (text.length === 0) {
        return [];
    }

    if (!preserveSentences) {
        const words = text.split(/\s+/);
        const chunks: string[] = [];
        let currentChunk = '';

        for (const word of words) {
            const potentialChunk = currentChunk + (currentChunk ? ' ' : '') + word;

            if (potentialChunk.length > maxChunkSize && currentChunk.length >= minChunkSize) {
                chunks.push(currentChunk.trim());
                currentChunk = word;
            } else {
                currentChunk = potentialChunk;
            }
        }

        if (currentChunk.trim()) {
            chunks.push(currentChunk.trim());
        }

        return chunks.filter(chunk => chunk.length >= minChunkSize);
    }

    const sentences = splitIntoSentences(text);
    const chunks: string[] = [];
    let currentChunk = '';

    for (const sentence of sentences) {
        const potentialChunk = currentChunk + (currentChunk ? ' ' : '') + sentence;

        if (potentialChunk.length > maxChunkSize && currentChunk.length >= minChunkSize) {
            chunks.push(currentChunk.trim());
            currentChunk = sentence;
        } else {
            currentChunk = potentialChunk;
        }
    }

    if (currentChunk.trim()) {
        chunks.push(currentChunk.trim());
    }

    return chunks.filter(chunk => chunk.length >= minChunkSize);
}

function splitIntoSentences(text: string): string[] {
    // First, protect abbreviations and decimals
    const protectedText = text
        .replace(/([A-Z][a-z]*\.)\s+/g, '$1<ABBREV>')
        .replace(/(\d+\.\d+)/g, '<DECIMAL>$1<DECIMAL>')
        .replace(/(Mr|Mrs|Ms|Dr|Prof|Sr|Jr|vs|etc|Inc|Ltd|Corp)\./g, '$1<ABBREV>');

    const sentences = protectedText
        .split(/(?<=[.!?])\s+(?=[A-Z])|(?<=[.!?])$/g)
        .map(sentence => sentence
            .replace(/<ABBREV>/g, '.')
            .replace(/<DECIMAL>/g, '')
            .trim()
        )
        .filter(sentence => sentence.length > 0);

    return sentences;
}

function cleanTextForChunking(text: string): string {
    return text
        // Normalize whitespace
        .replace(/[ \t]+/g, ' ')
        .replace(/\r\n/g, '\n')
        .replace(/\r/g, '\n')

        // Fix common spacing issues
        .replace(/([.!?])([A-Z])/g, '$1 $2')
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .replace(/([a-zA-Z])(\d)/g, '$1 $2')
        .replace(/(\d)([a-zA-Z])/g, '$1 $2')

        // Remove lines that are just special characters
        .replace(/^\s*[^\w\s.,;:!?-]\s*$/gm, '')

        // Normalize line breaks
        .replace(/\n\s*\n\s*\n+/g, '\n\n')
        .replace(/^\s+|\s+$/gm, '')

        // Split and rejoin to remove empty lines
        .split('\n')
        .filter(line => line.trim().length > 0)
        .join('\n')

        // Final cleanup
        .replace(/\n{3,}/g, '\n\n')
        .replace(/  +/g, ' ')
        .trim();
}

export function countWords(text: string): number {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
}


export function getTextStatistics(text: string): {
    wordCount: number;
    characterCount: number;
    sentenceCount: number;
    paragraphCount: number;
    tokenCount: number;
    tokenCoverage: number;
} {
    const wordCount = countWords(text);
    const characterCount = text.length;
    const sentenceCount = splitIntoSentences(text).length;
    const paragraphCount = text.split(/\n\s*\n/).filter(p => p.trim().length > 0).length;
    // Estimate token count based on character count (1 token ≈ 4 characters)
    const tokenCount = Math.ceil(characterCount / 4);
    const maxTokens = 1_048_576;
    const tokenCoverage = (tokenCount / maxTokens) * 100;
    return {
        wordCount,
        characterCount,
        sentenceCount,
        paragraphCount,
        tokenCount,
        tokenCoverage
    };
}
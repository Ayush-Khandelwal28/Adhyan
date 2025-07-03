import { StudyNotesStructure, ApplicationContentCollection, ApplicationContentItem } from '@/lib/types';
import generateFlashcards from '../langchain/generateFlashCards';


export function getApplicationContent(notes: StudyNotesStructure): ApplicationContentCollection {
    const items: ApplicationContentItem[] = [];

    // Process main sections
    for (const [, section] of notes.sections.entries()) {

        // Extract examples from main section
        if (section.examples?.length) {
            for (const [exampleIndex, example] of section.examples.entries()) {
                items.push({
                    content: example,
                    source: {
                        section: section.heading,
                        type: 'example',
                        index: exampleIndex,
                    },
                    context: `Example from section: ${section.heading}`,
                    relatedConcepts: extractRelatedConcepts(section),
                });
            }
        }

        // Extract connections from main section
        if (section.connections?.length) {
            for (const [connectionIndex, connection] of section.connections.entries()) {
                items.push({
                    content: connection,
                    source: {
                        section: section.heading,
                        type: 'connection',
                        index: connectionIndex,
                    },
                    context: `Connection from section: ${section.heading}`,
                    relatedConcepts: extractRelatedConcepts(section),
                });
            }
        }

        // Process subsections
        if (section.subsections?.length) {
            for (const [, subsection] of section.subsections.entries()) {

                // Examples in subsections
                if (subsection.examples?.length) {
                    for (const [exampleIndex, example] of subsection.examples.entries()) {
                        items.push({
                            content: example,
                            source: {
                                section: section.heading,
                                subsection: subsection.subheading,
                                type: 'example',
                                index: exampleIndex,
                            },
                            context: `Example from ${section.heading} → ${subsection.subheading}`,
                            relatedConcepts: extractRelatedConcepts(subsection),
                        });
                    }
                }

                // Connections in subsections
                if (subsection.connections?.length) {
                    for (const [connectionIndex, connection] of subsection.connections.entries()) {
                        items.push({
                            content: connection,
                            source: {
                                section: section.heading,
                                subsection: subsection.subheading,
                                type: 'connection',
                                index: connectionIndex,
                            },
                            context: `Connection from ${section.heading} → ${subsection.subheading}`,
                            relatedConcepts: extractRelatedConcepts(subsection),
                        });
                    }
                }
            }
        }
    }

    return {
        items,
        totalCount: items.length,
    };
}

function extractRelatedConcepts(context: any): string[] {
    const concepts: string[] = [];

    // Add concepts from points in the same section/subsection
    if (context.points?.length) {
        context.points.forEach((point: string) => {
            // Extract key terms (simplified approach)
            const keyTerms = point.split(/[.,;:]/)
                .map(term => term.trim())
                .filter(term => term.length > 3 && term.length < 50)
                .slice(0, 2); // Take first 2 key terms
            concepts.push(...keyTerms);
        });
    }

    // Add definitions as related concepts
    if (context.definitions?.length) {
        context.definitions.forEach((def: string) => {
            const term = def.split(':')[0]?.trim();
            if (term) concepts.push(term);
        });
    }

    return [...new Set(concepts)].slice(0, 5); // Remove duplicates, limit to 5
}


export default function generateApplicationCards(notes: StudyNotesStructure) {
    const applicationContent = getApplicationContent(notes);
    console.log("Application Content:", applicationContent);
    if (applicationContent.items.length === 0) {
        console.log("No application content found, returning empty array");
        return Promise.resolve([]);
    }
    return generateFlashcards('application', applicationContent.items);
}
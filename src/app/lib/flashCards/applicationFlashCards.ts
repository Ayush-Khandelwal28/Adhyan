import { StudyNotesStructure, ApplicationContentCollection, ApplicationContentItem } from '@/app/lib/types';
import generateFlashcards from '../langchain/generateFlashCards';


export function getApplicationContent(notes: StudyNotesStructure): ApplicationContentCollection {
    const items: ApplicationContentItem[] = [];
    const breakdown = {
        sectionExamples: [] as { section: string; count: number }[],
        sectionConnections: [] as { section: string; count: number }[],
        subsectionExamples: [] as { section: string; subsection: string; count: number }[],
        subsectionConnections: [] as { section: string; subsection: string; count: number }[],
    };

    // Process main sections
    for (const [sectionIndex, section] of notes.sections.entries()) {
        let sectionExampleCount = 0;
        let sectionConnectionCount = 0;

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
                    relatedConcepts: extractRelatedConcepts(section, example),
                });
                sectionExampleCount++;
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
                    relatedConcepts: extractRelatedConcepts(section, connection),
                });
                sectionConnectionCount++;
            }
        }

        // Process subsections
        if (section.subsections?.length) {
            for (const [subsectionIndex, subsection] of section.subsections.entries()) {
                let subsectionExampleCount = 0;
                let subsectionConnectionCount = 0;

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
                            relatedConcepts: extractRelatedConcepts(subsection, example),
                        });
                        subsectionExampleCount++;
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
                            relatedConcepts: extractRelatedConcepts(subsection, connection),
                        });
                        subsectionConnectionCount++;
                    }
                }

                if (subsectionExampleCount > 0) {
                    breakdown.subsectionExamples.push({
                        section: section.heading,
                        subsection: subsection.subheading,
                        count: subsectionExampleCount,
                    });
                }

                if (subsectionConnectionCount > 0) {
                    breakdown.subsectionConnections.push({
                        section: section.heading,
                        subsection: subsection.subheading,
                        count: subsectionConnectionCount,
                    });
                }
            }
        }

        if (sectionExampleCount > 0) {
            breakdown.sectionExamples.push({
                section: section.heading,
                count: sectionExampleCount,
            });
        }

        if (sectionConnectionCount > 0) {
            breakdown.sectionConnections.push({
                section: section.heading,
                count: sectionConnectionCount,
            });
        }
    }

    return {
        items,
        totalCount: items.length,
        breakdown,
    };
}

function extractRelatedConcepts(context: any, content: string): string[] {
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
    console.log(applicationContent);
    return generateFlashcards('application', applicationContent.items);
}
import { StudyNotesStructure, RecallContentItem, RecallContentCollection } from '@/app/lib/types';
import generateFlashcards from '../langchain/generateFlashCards';


export function getRecallContent(notes: StudyNotesStructure): RecallContentCollection {
    const items: RecallContentItem[] = [];

    // Process main sections
    for (const [sectionIndex, section] of notes.sections.entries()) {
        let sectionPointCount = 0;

        // Extract points from main section
        if (section.points?.length) {
            for (const [pointIndex, point] of section.points.entries()) {
                items.push({
                    content: point,
                    source: {
                        section: section.heading,
                        type: 'point',
                        index: pointIndex,
                    },
                    context: `From section: ${section.heading}`,
                });
                sectionPointCount++;
            }
        }

        // Process subsections
        if (section.subsections?.length) {
            for (const [subsectionIndex, subsection] of section.subsections.entries()) {
                let subsectionPointCount = 0;

                if (subsection.points?.length) {
                    for (const [pointIndex, point] of subsection.points.entries()) {
                        items.push({
                            content: point,
                            source: {
                                section: section.heading,
                                subsection: subsection.subheading,
                                type: 'point',
                                index: pointIndex,
                            },
                            context: `From ${section.heading} → ${subsection.subheading}`,
                        });
                        subsectionPointCount++;
                    }
                }
            }
        }
    }

    // Add key takeaways (high-priority recall items)
    if (notes.key_takeaways?.length) {
        for (const [index, takeaway] of notes.key_takeaways.entries()) {
            items.push({
                content: takeaway,
                source: {
                    section: 'Key Takeaways',
                    type: 'key_takeaway',
                    index: index,
                },
                context: 'High-priority concept for review',
            });
        }
    }

    return {
        items,
        totalCount: items.length,
    };
}



export default function generateRecallFlashcards(notes: StudyNotesStructure) {
    const recallContent = getRecallContent(notes);
    console.log(recallContent);
    return generateFlashcards('recall', recallContent.items);
}
import { StudyNotesStructure, FlashcardAvailability } from '@/lib/types';

export function analyzeFlashcardEligibility(notes: StudyNotesStructure): {
    availability: FlashcardAvailability;
    eligibleTypes: { type: string; count: number }[];
    breakdown: {
        definitions: { section: string; count: number }[];
        recall: { section: string; count: number }[];
        application: { section: string; count: number }[];
    };
} {
    let definitionCount = 0;
    let recallCount = 0;
    let applicationCount = 0;

    const breakdown = {
        definitions: [] as { section: string; count: number }[],
        recall: [] as { section: string; count: number }[],
        application: [] as { section: string; count: number }[],
    };

    // Process main sections
    for (const section of notes.sections) {
        let sectionDefinitions = 0;
        let sectionRecall = 0;
        let sectionApplication = 0;

        // Count definitions
        if (section.definitions?.length) {
            sectionDefinitions += section.definitions.length;
            definitionCount += section.definitions.length;
        }

        // Count recall items (points only, not subsections themselves)
        if (section.points?.length) {
            sectionRecall += section.points.length;
            recallCount += section.points.length;
        }

        // Count application items
        const sectionExamples = section.examples?.length || 0;
        const sectionConnections = section.connections?.length || 0;
        const sectionAppItems = sectionExamples + sectionConnections;
        sectionApplication += sectionAppItems;
        applicationCount += sectionAppItems;

        // Process subsections
        if (section.subsections?.length) {
            for (const subsection of section.subsections) {
                // Definitions in subsections
                if (subsection.definitions?.length) {
                    sectionDefinitions += subsection.definitions.length;
                    definitionCount += subsection.definitions.length;
                }

                // Points in subsections (actual recall content)
                if (subsection.points?.length) {
                    sectionRecall += subsection.points.length;
                    recallCount += subsection.points.length;
                }

                // Application items in subsections
                const subExamples = subsection.examples?.length || 0;
                const subConnections = subsection.connections?.length || 0;
                const subAppItems = subExamples + subConnections;
                sectionApplication += subAppItems;
                applicationCount += subAppItems;
            }
        }

        // Record breakdown
        if (sectionDefinitions > 0) {
            breakdown.definitions.push({ section: section.heading, count: sectionDefinitions });
        }
        if (sectionRecall > 0) {
            breakdown.recall.push({ section: section.heading, count: sectionRecall });
        }
        if (sectionApplication > 0) {
            breakdown.application.push({ section: section.heading, count: sectionApplication });
        }
    }

    // Add key takeaways to recall (these are high-value items)
    if (notes.key_takeaways?.length) {
        recallCount += notes.key_takeaways.length;
        breakdown.recall.push({ section: 'Key Takeaways', count: notes.key_takeaways.length });
    }

    const available = {
        definition: definitionCount,
        recall: recallCount,
        application: applicationCount,
    };

    const eligibleTypes: { type: string; count: number }[] = [];
    eligibleTypes.push({ type: 'definition', count: definitionCount });
    eligibleTypes.push({ type: 'recall', count: recallCount });
    eligibleTypes.push({ type: 'application', count: applicationCount });

    return {
        availability: available,
        eligibleTypes,
        breakdown,
    };
}
import { StudyNotesStructure, FlashcardAvailability } from '@/lib/types';

export function analyzeFlashcardEligibility(notes: StudyNotesStructure): {
    availability: FlashcardAvailability;
} {
    let definitionCount = 0;
    let recallCount = 0;
    let applicationCount = 0;

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
    }

    // Add key takeaways to recall (these are high-value items)
    if (notes.key_takeaways?.length) {
        recallCount += notes.key_takeaways.length;
    }

    const available = {
        definition: definitionCount,
        recall: recallCount,
        application: applicationCount,
    };

    return {
        availability: available,
    };
}
import { StudyNotesStructure, StudyNotesSection, StudyNotesSubsection } from '@/app/lib/types';
import { QuizContentConfig, ExtractedQuizContent, QuizSection } from '@/app/lib/types';

export class QuizContentExtractor {

    //   Main method to extract content optimized for quiz generation
    static extractContentForQuizzes(
        studyNotes: StudyNotesStructure,
        config: QuizContentConfig
    ): ExtractedQuizContent {
        const sections = this.getAllSections(studyNotes, config);
        const scoredSections = this.scoreSections(sections, config);
        const filteredSections = this.filterSections(scoredSections, config);

        return {
            title: studyNotes.title,
            summary: studyNotes.summary,
            totalSections: sections.length,
            extractedSections: filteredSections,
            metadata: this.generateMetadata(filteredSections)
        };
    }

    // Convert nested structure to flat array of sections
    private static getAllSections(
        studyNotes: StudyNotesStructure,
        config: QuizContentConfig
    ): QuizSection[] {
        const sections: QuizSection[] = [];

        for (const section of studyNotes.sections) {
            // Add main section
            sections.push(this.convertToQuizSection(section, 'main'));

            // Add subsections if enabled
            if (config.includeSubsections && section.subsections) {
                for (const subsection of section.subsections) {
                    sections.push(this.convertToQuizSection(
                        subsection,
                        'sub',
                        section.heading
                    ));
                }
            }
        }

        return sections;
    }

    // Convert section/subsection to QuizSection format
    private static convertToQuizSection(
        section: StudyNotesSection | StudyNotesSubsection,
        level: 'main' | 'sub',
        parentHeading?: string
    ): QuizSection {
        return {
            heading: 'heading' in section ? section.heading : section.subheading,
            level,
            parentHeading,
            points: section.points || [],
            definitions: section.definitions || [],
            examples: section.examples || [],
            score: 0 // Will be calculated later
        };
    }

    // Score sections based on their quiz generation potential
    private static scoreSections(
        sections: QuizSection[],
        config: QuizContentConfig
    ): QuizSection[] {
        return sections.map(section => ({
            ...section,
            score: this.calculateSectionScore(section, config)
        }));
    }

    // Calculate quality score for quiz generation
    private static calculateSectionScore(
        section: QuizSection,
        config: QuizContentConfig
    ): number {
        let score = 0;

        // Base score from content quantity
        score += section.points.length * 2;
        score += section.definitions.length * 3;
        score += section.examples.length * 2.5;

        // Penalty for sections with too few points
        if (section.points.length < (config.minPointsPerSection || 2)) {
            score *= 0.75;
        }

        return Math.round(score * 100) / 100;
    }

    // Filter sections based on config criteria
    private static filterSections(
        sections: QuizSection[],
        config: QuizContentConfig
    ): QuizSection[] {
        let filtered = sections;

        // Filter by minimum points
        if (config.minPointsPerSection) {
            filtered = filtered.filter(s => s.points.length >= config.minPointsPerSection!);
        }

        // Sort by score 
        filtered.sort((a, b) => b.score - a.score);

        return filtered;
    }

    // Generate metadata about extracted content
    private static generateMetadata(sections: QuizSection[]) {
        const totalPoints = sections.reduce((sum, s) => sum + s.points.length, 0);
        const totalDefinitions = sections.reduce((sum, s) => sum + s.definitions.length, 0);
        const totalExamples = sections.reduce((sum, s) => sum + s.examples.length, 0);

        const contentTypes: string[] = [];
        if (totalDefinitions > 0) contentTypes.push('definitions');
        if (totalExamples > 0) contentTypes.push('examples');
        if (totalPoints > 0) contentTypes.push('concepts');

        return {
            totalPoints,
            totalDefinitions,
            totalExamples,
            contentTypes
        };
    }
}


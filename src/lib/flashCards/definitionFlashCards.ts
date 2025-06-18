import { StudyNotesStructure, Flashcard } from '@/lib/types';

export default function generateDefinitionFlashcards(notes: StudyNotesStructure) {
    const flashcards: Flashcard[] = [];

    for (const section of notes.sections) {
        const defs = section.definitions || [];

        defs.forEach((definition) => {
            const [term] = definition.split(':');
            flashcards.push({
                type: 'definition',
                front: `What is ${term}?`,
                back: definition,
            });
        });

        section.subsections?.forEach((sub) => {
            sub.definitions?.forEach((definition) => { 
                const [term] = definition.split(':');
                flashcards.push({
                    type: 'definition',
                    front: `What is ${term}?`,
                    back: definition,
                });
            });
        });
    }

    return flashcards;
}

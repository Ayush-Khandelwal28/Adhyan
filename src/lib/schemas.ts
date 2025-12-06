import { z } from "zod";

// --- Study Notes Schema ---
export const studyNotesSubsectionSchema = z.object({
    subheading: z.string(),
    points: z.array(z.string()),
    definitions: z.array(z.string()).optional(),
    examples: z.array(z.string()).optional(),
    connections: z.array(z.string()).optional(),
});

export const studyNotesSectionSchema = z.object({
    heading: z.string(),
    points: z.array(z.string()),
    definitions: z.array(z.string()).optional(),
    examples: z.array(z.string()).optional(),
    connections: z.array(z.string()).optional(),
    subsections: z.array(studyNotesSubsectionSchema).optional(),
});

export const studyNotesSchema = z.object({
    title: z.string(),
    sections: z.array(studyNotesSectionSchema),
    key_takeaways: z.array(z.string()).optional(),
    summary: z.string(),
});

// --- Flashcards Schema ---
export const flashcardSchema = z.object({
    type: z.enum(["definition", "recall", "application"]).optional().default("recall"),
    front: z.string().min(1, "Front cannot be empty"),
    back: z.string().min(1, "Back cannot be empty"),
});

export const flashcardArraySchema = z.array(flashcardSchema);

// --- Quiz Schemas ---
export const mcqOptionSchema = z.object({
    text: z.string().min(1),
    isCorrect: z.boolean(),
});

export const mcqQuestionSchema = z.object({
    type: z.literal("MCQ").default("MCQ"),
    question: z.string().min(1),
    options: z.array(mcqOptionSchema).length(4),
    explanation: z.string().optional(),
});

export const trueFalseQuestionSchema = z.object({
    type: z.literal("TRUE_FALSE").default("TRUE_FALSE"),
    statement: z.string().min(1),
    isTrue: z.boolean(),
    explanation: z.string().optional(),
});

// We can export a union if needed, or specific arrays
export const mcqQuizSchema = z.array(mcqQuestionSchema);
export const trueFalseQuizSchema = z.array(trueFalseQuestionSchema);

// --- Mind Map Schema ---
// Recursive schema definition for nodes
const baseMindMapNodeSchema = z.object({
    label: z.string(),
    node_type: z.enum(["concept", "detail", "example"]),
    emphasis_level: z.enum(["high", "medium", "low"]).optional(),
});

export type MindMapNode = z.infer<typeof baseMindMapNodeSchema> & {
    children?: MindMapNode[];
};

export const mindMapNodeSchema: z.ZodType<MindMapNode> = baseMindMapNodeSchema.extend({
    children: z.lazy(() => z.array(mindMapNodeSchema).optional()),
});

export const mindMapBranchSchema = z.object({
    branch_label: z.string(),
    main_nodes: z.array(mindMapNodeSchema),
});

export const mindMapSchema = z.object({
    central_concept: z.string(),
    branches: z.array(mindMapBranchSchema),
});

// Export inferred types if useful (though we have types.ts already)
export type StudyNotesStructure = z.infer<typeof studyNotesSchema>;
// ... etc

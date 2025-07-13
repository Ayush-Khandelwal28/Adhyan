'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Upload, FileType, Filter, FileText, BookOpen, Zap, Brain } from 'lucide-react';
import { RiNextjsLine, RiGeminiFill } from "react-icons/ri";
import { TbBrandTypescript } from "react-icons/tb";
import { SiPrisma, SiShadcnui } from "react-icons/si";
import { BiLogoPostgresql } from "react-icons/bi";
import { StudyFormatCallout } from './StudyFormatCallout';

import { LucideIcon } from 'lucide-react';
import { IconType } from 'react-icons';

interface ProcessStepProps {
    step: number;
    title: string;
    description: string;
    icon: LucideIcon | IconType;
    details: string[];
    isRight?: boolean;
    delay: number;
}

const ProcessStep = ({ step, title, description, icon: Icon, details, isRight = false, delay }: ProcessStepProps) => {
    const [ref, inView] = useInView({
        triggerOnce: true,
        threshold: 0.1,
        rootMargin: '50px'
    });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, x: isRight ? 20 : -20 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: isRight ? 20 : -20 }}
            transition={{ duration: 0.6, delay: delay * 0.1 }}
            className={`flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-12 mb-16`}
        >
            {/* Step Number - Mobile Only */}
            <div className="md:hidden flex-shrink-0 flex items-center justify-center w-14 h-14 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xl font-bold">
                {step}
            </div>

            {/* Content Layout */}
            <div className={`flex flex-col md:flex-row w-full items-center ${isRight ? 'md:flex-row-reverse' : ''}`}>
                {/* Icon Column */}
                <div className="mb-6 md:mb-0 md:w-1/4 flex justify-center">
                    <div className="relative">
                        {/* Desktop Step Number */}
                        <div className="hidden md:flex absolute -top-4 -left-4 items-center justify-center w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-lg font-bold">
                            {step}
                        </div>

                        {/* Icon */}
                        <div className="w-24 h-24 flex items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 shadow-md">
                            <Icon className="h-12 w-12 text-blue-500 dark:text-blue-400" />
                        </div>
                    </div>
                </div>

                {/* Text Content */}
                <div className={`md:w-3/4 ${isRight ? 'md:pr-10 text-right' : 'md:pl-10 text-left'}`}>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">{title}</h3>
                    <p className="text-lg text-gray-600 dark:text-gray-300 mb-5">{description}</p>

                    {/* Detailed Points */}
                    <ul className={`space-y-4 ${isRight ? 'md:ml-auto' : ''}`}>
                        {details.map((detail, idx) => (
                            <li key={idx} className="flex items-start gap-3 text-left">
                                <div className="mt-2 h-2 w-2 rounded-full bg-blue-500 flex-shrink-0"></div>
                                <span className="text-base text-gray-600 dark:text-gray-300">{detail}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </motion.div>
    );
};

export function HowItWorks() {
    const [ref, inView] = useInView({
        triggerOnce: true,
        threshold: 0.1,
        rootMargin: '50px'
    });

    const processSteps = [
        {
            step: 1,
            title: "Content Upload & Type Detection",
            description: "Upload your learning material in multiple formats.",
            icon: Upload,
            details: [
                "Supported formats: PDF documents, YouTube video URLs, and plain text.",
                "The content type is automatically detected through validation checks. YouTube links are verified using regular expressions, and all inputs undergo quality checks to ensure they meet minimum standards."
            ]
        },
        {
            step: 2,
            title: "Source-Specific Extraction",
            description: "Content is extracted using specialized methods for each format.",
            icon: FileType,
            details: [
                "PDF extraction uses unpdf to preserve structure; YouTube transcripts are retrieved using Tactiq API.",
                "Text normalization ensures sentence integrity, while text statistics (word/sentence count, token usage) guide further processing."
            ],
            isRight: true
        },
        {
            step: 3,
            title: "Content Filtering & Preparation",
            description: "Content is filtered and organized for optimal learning.",
            icon: Filter,
            details: [
                "Content is chunked into 100–1000 characters and cleaned of redundancy or irrelevant info.",
                "Key concepts are identified, prioritized, and aligned to focus learning."
            ]
        },
        {
            step: 4,
            title: "Gemini AI Structured Notes",
            description: "Google's Gemini AI transforms filtered content into organized notes.",
            icon: FileText,
            details: [
                "Gemini 2.0 Flash processes content using specialized prompts and structures it into with sections, takeaways and summary.",
                "Definitions, examples, and links are categorized explicitly, guided by system prompts for optimal learning format."
            ],
            isRight: true
        },
        {
            step: 5,
            title: "Flashcard Generation",
            description: "Three specialized flashcard types with targeted content extraction.",
            icon: BookOpen,
            details: [
                "Three distinct flashcard types are generated: Definition cards (term-definition pairs), Recall cards (key points and headings), and Application cards (examples and conceptual connections).",
                "Each type uses tailored data extraction, ensuring the content is filtered to best suit its learning purpose with custom Gemini prompts guiding how information is selected and structured."
            ]
        },
        {
            step: 6,
            title: "Interactive Quiz System",
            description: "AI-generated quizzes with adaptive difficulty and content prioritization.",
            icon: Zap,
            details: [
                "Two Quiz Types with Customization: Users can choose between MCQs and True/False quizzes, with options to set difficulty and number of questions for a tailored learning experience.",
                "Smart Content Extraction & Balancing: Quiz content is extracted and scored based on importance which ensures ensures high-quality, well-rounded questions."
            ],
            isRight: true
        },
        {
            step: 7,
            title: "Visual Mind Map Creation",
            description: "Complex relationships are visualized through interactive mind maps.",
            icon: Brain,
            details: [
                "Gemini analyzes JSON notes to identify relationships and builds maps with a central concept and 3–6 main branches.",
                "Content is prioritized by importance, and cross-branch conceptual links are intelligently created."
            ]
        }
    ];


    const techStack = [
        {
            icon: RiGeminiFill,
            name: "Gemini 2.0",
            description: "AI Model",
        },
        {
            icon: RiNextjsLine,
            name: "Next.js 15",
            description: "React Framework",
        },
        {
            icon: TbBrandTypescript,
            name: "TypeScript",
            description: "Type Safety",
        },
        {
            icon: SiPrisma,
            name: "Prisma",
            description: "ORM",
        },
        {
            icon: BiLogoPostgresql,
            name: "PostgreSQL",
            description: "Database",
        },
        {
            icon: SiShadcnui,
            name: "shadcn/ui",
            description: "UI Components",
        }
    ];

    return (
        <section id="how-it-works" className="py-24 md:py-32 px-6 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
            <div className="max-w-6xl mx-auto">
                <motion.div
                    ref={ref}
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-24"
                >
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                        How <span className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">Adhyan Works</span>
                    </h2>
                    <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                        A comprehensive guide to our AI-powered content transformation system
                    </p>
                    <p className="mt-5 text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
                        Discover how we process your learning materials, filter the content intelligently, and use Google&apos;s Gemini AI to create multiple tailored study formats
                    </p>
                </motion.div>

                {/* Process Steps */}
                <div className="space-y-28">
                    {processSteps.map((step, index) => (
                        <div key={index} className="relative">
                            <ProcessStep
                                step={step.step}
                                title={step.title}
                                description={step.description}
                                icon={step.icon}
                                details={step.details}
                                isRight={step.isRight}
                                delay={index}
                            />

                            {step.step === 5 && (
                                <StudyFormatCallout
                                    title="Flashcard Types & Content Processing"
                                    type="flashcard"
                                    items={[
                                        {
                                            title: "Definition Cards",
                                            description: "Directly parses term-definition pairs from 'definitions' arrays and formats them as 'What is X?' question cards.",
                                            color: "blue"
                                        },
                                        {
                                            title: "Recall Cards",
                                            description: "Uses LangChain to transform extracted points, headings, and key takeaways into question-answer pairs via Gemini AI.",
                                            color: "green"
                                        },
                                        {
                                            title: "Application Cards",
                                            description: "Identifies examples and connections in content, extracts related concepts, and generates scenario-based cards with context.",
                                            color: "purple"
                                        }
                                    ]}
                                />
                            )}

                            {step.step === 6 && (
                                <StudyFormatCallout
                                    title="Quiz Format & Content Extraction"
                                    type="quiz"
                                    items={[
                                        {
                                            title: "MCQ Generation",
                                            description: "Analyzes content importance based on type and scores them accordingly (definitions: 3x, examples: 2.5x, points: 2x) to generate 4-option questions.",
                                            color: "amber"
                                        },
                                        {
                                            title: "True/False Creation",
                                            description: "Generates balanced sets of true statements and carefully modified false statements with custom prompt instructions.",
                                            color: "orange"
                                        },
                                        {
                                            title: "Content Distribution",
                                            description: "Creates a balanced mix across content types: definitions (25%), concepts (50%), applications (25%).",
                                            color: "purple"
                                        }
                                    ]}
                                />
                            )}

                            {step.step === 7 && (
                                <StudyFormatCallout
                                    title="Mind Map Node Types & Processing"
                                    type="flashcard"
                                    items={[
                                        {
                                            title: "Concept Nodes",
                                            description: "Primary ideas marked with 'high' emphasis level, organized in radial branches from a central concept with specialized positioning algorithms.",
                                            color: "blue"
                                        },
                                        {
                                            title: "Detail Nodes",
                                            description: "Supporting facts and elaborations marked with 'medium' emphasis, arranged in optimal positions using mathematical angle calculations.",
                                            color: "purple"
                                        },
                                        {
                                            title: "Example Nodes",
                                            description: "Concrete illustrations with 'low' emphasis level, connected to parent concepts with color-coded edges based on node type.",
                                            color: "green"
                                        }
                                    ]}
                                />
                            )}
                        </div>
                    ))}
                </div>

                {/* Technology Stack */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                    className="mt-36 text-center"
                >
                    <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-10">
                        Built With <span className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">Modern Technologies</span>
                    </h3>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-10 max-w-5xl mx-auto">
                        {techStack.map((tech, index) => (
                            <motion.div 
                                key={index} 
                                className="flex flex-col items-center"
                                initial={{ opacity: 0, y: 15 }}
                                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
                                transition={{ duration: 0.4, delay: 0.8 + (index * 0.1) }}
                            >
                                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 p-5 rounded-xl shadow-md h-24 w-24 flex items-center justify-center border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 hover:scale-105">
                                    <tech.icon className={`h-12 w-12 text-blue-600 dark:text-blue-400`} />
                                </div>
                                <span className="text-base font-medium mt-3 text-gray-800 dark:text-gray-200">{tech.name}</span>
                                <span className="text-sm text-gray-600 dark:text-gray-400">{tech.description}</span>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

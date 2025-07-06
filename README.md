# Adhyan - AI-Powered Study Platform

Transform your PDFs, text, and YouTube videos into smart study materials with AI-powered note generation, flashcards, quizzes, and mind maps.

## 🌟 Features

### Content Processing
- **PDF Upload**: Extract and process text from PDF documents
- **Text Input**: Direct text input for study material creation
- **YouTube Integration**: Extract transcripts from YouTube videos
- **Smart Content Analysis**: AI-powered content structuring and organization

### Study Tools
- **Structured Notes**: Hierarchical, organized study notes with table of contents
- **Flashcards**: Three types - Definition, Recall, and Application cards
- **Interactive Quizzes**: Multiple choice and True/False questions with instant feedback
- **Mind Maps**: Visual concept mapping with interactive nodes


## 🚀 Tech Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **AI**: Google Gemini 2.0 Flash via LangChain
- **Authentication**: NextAuth.js


## 🎯 How It Works

### Content Processing Pipeline
1. **Upload**: User uploads PDF, enters text, or provides YouTube URL
2. **Extraction**: System extracts raw text content
3. **Processing**: Content is cleaned, chunked, and analyzed
4. **AI Generation**: Google Gemini creates structured study materials
5. **Storage**: Generated content is saved to database
6. **Presentation**: User accesses formatted study materials

### AI-Powered Features
- **Smart Structuring**: Automatically organizes content into logical sections
- **Flashcard Generation**: Creates three types of flashcards
- **Quiz Creation**: Generates relevant questions with explanations
- **Mind Map Building**: Constructs visual relationship maps

## 🧠 Content Filtering & AI Organization

### Smart Content Preprocessing
Before sending content to Google Gemini, Adhyan employs sophisticated filtering and organization strategies to ensure optimal AI generation quality:

#### 📊 Quiz Content Filtering
- **Multi-stage Scoring System**: Content is scored based on quiz-worthiness
  - Definitions: 3x weight (highest priority for quiz questions)
  - Examples: 2.5x weight (good for application questions)
  - Key points: 2x weight (factual recall questions)
- **Quality Thresholds**: Filters out sections with insufficient content depth
- **Score-based Ranking**: Best content is prioritized for Gemini processing
- **Content Type Analysis**: Automatically identifies definitions, examples, and concepts

#### 🧠 Flashcard Content Segmentation
- **Recall Cards**: Extracts factual content, definitions, and key takeaways
- **Application Cards**: Focuses on examples and conceptual connections
- **Definition Cards**: Simple extraction of all term-definition pairs

#### 🗺️ Mindmap Content Strategy
- **Comprehensive Processing**: Uses complete structured notes
- **Hierarchical Preservation**: Maintains section-subsection relationships
- **Concept Relationship Mapping**: Identifies connections between ideas


### Gemini Prompt Engineering
- **Context-Rich Prompts**: Includes section context and learning objectives
- **Type-Specific Instructions**: Tailored prompts for each content type
- **Quality Guidelines**: Built-in quality standards for AI generation
- **JSON Structure Enforcement**: Consistent output formatting

## 📚 Study Material Types

### 📝 Structured Notes
- Hierarchical organization with main sections and subsections
- Key points, definitions, examples, and connections
- Table of contents for easy navigation

### 🧠 Flashcards
- **Definition Cards**: Key terms and their meanings
- **Recall Cards**: Important facts and concepts
- **Application Cards**: Examples and practical applications

### ❓ Interactive Quizzes
- Multiple choice questions with 4 options
- True/False statements with explanations
- Immediate feedback and scoring
- Performance tracking and analytics

### 🗺️ Mind Maps
- Visual representation of concepts
- Interactive nodes with relationships
- Hierarchical structure visualization
- React Flow-based implementation

## 🏗️ Architecture Overview

```
src/
├── app/                    # Next.js App Router
│   ├── api/                # Serverless API endpoints
│   ├── auth/               # Authentication pages
│   ├── dashboard/          # Main user dashboard
│   └── studypack/          # Study material viewer
├── components/             # Reusable React components
│   ├── dashboard/          # Dashboard-specific components
│   ├── landing/            # Landing page components
│   ├── flashcards/         # Flashcard study interface
│   ├── mindmap/            # Mind map visualization components
│   ├── quiz/               # Quiz components
│   └── studyPack/          # Study pack viewer components
│   ├── ui/                 # Base UI components (Radix)
├── lib/                    # Utility functions and configs
│   ├── auth/               # Authentication helpers
│   ├── contentUpload/      # Content processing utilities
│   ├── flashCards/         # Flashcard generation logic
│   ├── langchain/          # Gemini Calls
│   └── quizzes/            # Quiz generation
├── hooks/                  # Custom React hooks
└── contexts/               # React Context providers
```

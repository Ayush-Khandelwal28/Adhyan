import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

let geminiClient: ChatGoogleGenerativeAI | null = null;

export const getGeminiClient = (): ChatGoogleGenerativeAI => {
  if (!geminiClient) {
    geminiClient = new ChatGoogleGenerativeAI({
      apiKey: process.env.GOOGLE_API_KEY,
      model: "gemini-2.0-flash",
    });
  }
  return geminiClient;
};

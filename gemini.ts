import { GoogleGenAI } from "@google/genai";

const getGenAI = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("GEMINI_API_KEY is not defined.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const generateStudyGuide = async (topicTitle: string, level: string, description: string) => {
  const genAI = getGenAI();
  if (!genAI) return "Failed to generate study guide. API key is missing.";
  const model = "gemini-3-flash-preview";
  const prompt = `You are an expert Economics tutor. Generate a comprehensive study guide for a ${level} student on the topic: "${topicTitle}". 
  Description: ${description}
  
  Format the output in Markdown with:
  - Clear headings
  - Key definitions
  - Detailed explanations
  - Examples where applicable
  - Professional Markdown tables for data (ensure proper rows and columns)
  - Mathematical expressions formatted in LaTeX using $ for inline and $$ for block math. Ensure all LaTeX commands (like \frac, \Delta, \epsilon) are correctly formatted with a single backslash as per standard LaTeX.
  - A summary section
  
  Make it educational, engaging, and easy to understand for a ${level} level.`;

  try {
    const response = await genAI.models.generateContent({
      model,
      contents: [{ parts: [{ text: prompt }] }],
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Failed to generate study guide. Please try again later.";
  }
};

export const generateQuestions = async (topicTitle: string, level: string, count: number = 5) => {
  const genAI = getGenAI();
  if (!genAI) return [];
  const model = "gemini-3-flash-preview";
  const prompt = `You are an expert Economics examiner. Generate ${count} multiple-choice questions for a ${level} student on the topic: "${topicTitle}".
  
  Each question must have:
  - A clear question text
  - Exactly 4 options
  - The index of the correct answer (0-3)
  - A brief explanation for the correct answer
  
  Return the response in JSON format as an array of objects with the following schema:
  [
    {
      "question": "string",
      "options": ["string", "string", "string", "string"],
      "correctAnswer": number,
      "explanation": "string"
    }
  ]
  
  Ensure the questions are challenging but appropriate for the ${level} level.`;

  try {
    const response = await genAI.models.generateContent({
      model,
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
      }
    });
    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("Gemini Error:", error);
    return [];
  }
};

const { GoogleGenAI } = require('@google/genai');
const fs = require('fs');

async function run() {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  console.log('Starting generation...');
  
  const chapters = parseInt(process.argv[2], 10);
  
  const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: `Create highly detailed, comprehensive study guide notes for Chapter ${chapters} of "Development Economics" by Debraj Ray. Carefully extract all content down to the subtopics, and include all relevant mathematical expressions (using $$), tables, and descriptions of graphs based on the standard textbook content. Do not summarize; be very detailed. Output ONLY raw markdown.`,
  });
  
  fs.appendFileSync('development_economics.md', response.text.trim() + '\n\n');
  console.log(`Chapter ${chapters} generated.`);
}

run().catch(console.error);

const { GoogleGenAI } = require('@google/genai');
const fs = require('fs');

async function run() {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const startCh = parseInt(process.argv[2], 10);
  const endCh = parseInt(process.argv[3], 10);
  
  console.log(`Generating chapters ${startCh} to ${endCh}...`);
  
  const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: `Create highly detailed, comprehensive study guide notes for Chapters ${startCh} to ${endCh} of "Development Economics" by Debraj Ray. Carefully extract all content from these specific chapters down to the subtopics, and include all relevant mathematical expressions (using $$), tables, and descriptions of graphs based on the standard textbook content. Do not summarize; be very detailed. Output ONLY raw markdown. Output everything in a single, well-formatted markdown response without any conversational prefix or suffix.`,
  });
  
  fs.appendFileSync('development_economics.md', response.text.trim() + '\n\n');
  console.log(`Chapters ${startCh} to ${endCh} generated.`);
}

run().catch(console.error);

const { GoogleGenAI } = require('@google/genai');
const fs = require('fs');

async function run() {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  console.log('Starting interaction...');
  
  const interaction = await ai.interactions.create({
      model: 'gemini-3.5-flash',
      input: 'You are an economics expert. Generate a highly detailed, comprehensive study guide for "Development Economics" by Debraj Ray. Carefully extract all content from the chapters and subtopics, and include all relevant mathematical expressions (using $$), tables, and descriptions of graphs. Do not summarize; provide detailed notes. Output ONLY the raw markdown content without any prepended conversational text, so we can save it directly.',
  });
  
  let fullReport = '';
  for (const step of interaction.steps) {
      if (step.type === 'model_output') {
          const textContent = step.content?.find(c => c.type === 'text');
          if (textContent) fullReport += textContent.text;
      }
  }
  
  fs.writeFileSync('development_economics.md', fullReport.trim());
  console.log('Done!');
}

run().catch(console.error);

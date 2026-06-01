const { GoogleGenAI } = require('@google/genai');
const fs = require('fs');

async function run() {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  console.log('Starting generation for Development Economics...');
  
  let fullOutput = '# Development Economics by Debraj Ray - Study Guide\n\n';
  fs.writeFileSync('development_economics.md', fullOutput);

  // Group chapters to avoid too many requests
  const chapterGroups = [
    'Chapters 1-3 (Introduction, Economic Development Overview, Economic Growth)',
    'Chapters 4-6 (New Growth Theories, History/Expectations, Economic Inequality)',
    'Chapters 7-9 (Inequality Interconnections, Poverty & Undernutrition, Population Growth)',
    'Chapters 10-12 (Rural and Urban, Markets in Agriculture, Land)',
    'Chapters 13-15 (Labor, Credit, Insurance)',
    'Chapters 16-18 (International Trade, Trade Policy, Multilateral Approaches)'
  ];

  for (const group of chapterGroups) {
      console.log(`Generating: ${group}...`);
      const response = await ai.models.generateContent({
          model: 'gemini-3.5-pro',
          contents: `Create highly detailed, comprehensive study guide notes for the following chapters of "Development Economics" by Debraj Ray: ${group}. Carefully extract all content down to the subtopics, and include all relevant mathematical expressions (using $$), tables, and descriptions of graphs. Do not summarize; be very detailed. Output ONLY raw markdown without any conversational wrapper.`,
      });
      fs.appendFileSync('development_economics.md', response.text.trim() + '\n\n');
  }

  console.log('Done!');
}

run().catch(console.error);

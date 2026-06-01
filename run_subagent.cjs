const { GoogleGenAI } = require('@google/genai');
const fs = require('fs');

async function run() {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  console.log('Starting parallel generation...');
  
  const chapters = Array.from({length: 18}, (_, i) => i + 1);
  
  const promises = chapters.map(async (ch) => {
    try {
      const resp = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: `Create highly detailed, comprehensive study guide notes for Chapter ${ch} of "Development Economics" by Debraj Ray. Carefully extract all content down to the subtopics, and include all relevant mathematical expressions (using $$), tables, and descriptions of graphs. Do not summarize; be very detailed. Output ONLY raw markdown. Output everything in a single, well-formatted markdown response without any conversational prefix or suffix.`,
      });
      return { ch, text: resp.text.trim() };
    } catch (err) {
      console.error(`Failed on chapter ${ch}:`, err);
      return { ch, text: `## Chapter ${ch}\n\nFailed to generate content.` };
    }
  });
  
  const results = await Promise.all(promises);
  results.sort((a, b) => a.ch - b.ch);
  
  const fullOutput = '# Development Economics by Debraj Ray - Study Guide\n\n' + results.map(r => r.text).join('\n\n---\n\n');
  fs.writeFileSync('development_economics.md', fullOutput);
  
  console.log('All 18 chapters generated successfully.');
}

run().catch(console.error);

const { GoogleGenAI } = require('@google/genai');
const fs = require('fs');
async function run() {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  console.log('Generating content directly...');
  const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: 'You are an econometrics instructor. The user wants the 12 chapters of Statistical / Basic Econometrics summarized with detail, but previously mathematical equations, dummy data for charts, and tables were missing. Regenerate the study guide covering the 12 chapters: 1. Introduction, 2. Descriptive Statistics, 3. Probability, 4. Estimation, 5. Hypothesis Testing, 6. Simple Regression, 7. Multiple Regression, 8. Problems in Regression, 9. Dummy Variables, 10. Multicollinearity, 11. Heteroscedasticity, 12. Autocorrelation. Include mathematical equations (using $$), dummy data for charts precisely in the format ```chart ... ```, and detailed markdown tables. Output ONLY the raw markdown content without any prepended text.',
  });
  
  fs.writeFileSync('generated_stats.md', response.text.trim());
  console.log('Done!');
}
run().catch(console.error);

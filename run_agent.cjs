const { GoogleGenAI } = require('@google/genai');
const fs = require('fs');
async function run() {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  console.log('Starting interaction...');
  const interaction = await ai.interactions.create({
      model: 'gemini-3.5-flash',
      input: 'You are an econometrics expert. Generate a comprehensive 12-chapter study guide for Statistical / Basic Econometrics. Include essential mathematical equations (using $$), dummy data for charts precisely in the format ```chart ... ```, and detailed markdown tables. The chapters should be: 1. Introduction, 2. Descriptive Statistics, 3. Probability, 4. Estimation, 5. Hypothesis Testing, 6. Simple Regression, 7. Multiple Regression, 8. Problems in Regression, 9. Dummy Variables, 10. Multicollinearity, 11. Heteroscedasticity, 12. Autocorrelation. Output ONLY the raw markdown content. No conversational prefix.',
  });
  
  let fullReport = '';
  for (const step of interaction.steps) {
      if (step.type === 'model_output') {
          const textContent = step.content?.find(c => c.type === 'text');
          if (textContent) fullReport += textContent.text;
      }
  }
  fs.writeFileSync('generated_stats.md', fullReport.trim());
  console.log('Done!');
}
run().catch(console.error);

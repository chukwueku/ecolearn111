const katex = require('katex');
const fs = require('fs');

function cleanMarkdownContent(text) {
  if (!text) return text;
  
  let cleaned = text;

  // 1. Normalize brackets
  cleaned = cleaned.replace(/\\\\\[/g, '$$').replace(/\\\\\]/g, '$$');
  cleaned = cleaned.replace(/\\\\\(/g, '$').replace(/\\\\\)/g, '$');
  cleaned = cleaned.replace(/\\\[/g, '$$').replace(/\\\]/g, '$$');
  cleaned = cleaned.replace(/\\\(/g, '$').replace(/\\\)/g, '$');

  // 2. Fix double backslashes in LaTeX commands
  cleaned = cleaned.replace(/\\\\\\\\/g, '__LATEX_NEWLINE__');
  cleaned = cleaned.replace(/\\\\([a-zA-Z]+)/g, '\\$1');
  cleaned = cleaned.replace(/\\\\([^a-zA-Z\s])/g, '\\$1');
  cleaned = cleaned.replace(/__LATEX_NEWLINE__/g, '\\\\');

  // 3. Math block protection and currency dollar signs
  const parts = [];
  let lastIndex = 0;
  const mathRegex = /\$\$([\s\S]+?)\$\$|\$([^\$\n]+?)\$/g;
  let match;

  while ((match = mathRegex.exec(cleaned)) !== null) {
    let nonMath = cleaned.substring(lastIndex, match.index);
    nonMath = nonMath.replace(/\$(\d[\d,]*(\.\d+)?)/g, '\\$$1');
    parts.push(nonMath);

    let mathContent = match[0];
    mathContent = mathContent.replace(/(\\text\{[^\}]*?)(%)(.*?\}\})/g, '$1\\%$3')
                            .replace(/(\\text\{[^\}]*?)(%)(.*?\})/g, '$1\\%$3');
    parts.push(mathContent);

    lastIndex = mathRegex.lastIndex;
  }

  let remainder = cleaned.substring(lastIndex);
  remainder = remainder.replace(/\$(\d[\d,]*(\.\d+)?)/g, '\\$$1');
  parts.push(remainder);

  return parts.join('');
}

const files = [
  'src/lib/advancedStudyData.ts',
  'src/lib/econometricsChapters.ts',
  'src/lib/internationalEconomicsChapters.ts',
  'src/lib/statisticalEconomicsData.ts',
  'src/lib/studyData.ts',
  'src/lib/ss2StudyData.ts',
  'src/lib/ss3StudyData.ts'
];

files.forEach(file => {
  if (!fs.existsSync(file)) return;
  const content = fs.readFileSync(file, 'utf8');
  const cleaned = cleanMarkdownContent(content);

  const regex = /\$\$([\s\S]+?)\$\$|\$([^\$\n]+?)\$/g;
  let match;
  let errCount = 0;
  const errMsgs = [];
  while ((match = regex.exec(cleaned)) !== null) {
    const math = match[1] || match[2];
    try {
      katex.renderToString(math, { throwOnError: true });
    } catch (e) {
      errCount++;
      if (errMsgs.length < 5) {
        errMsgs.push({ math: math.trim(), err: e.message, full: match[0] });
      }
    }
  }
  console.log(`=== ${file} ===`);
  console.log(`  KaTeX Parse Errors: ${errCount}`);
  errMsgs.forEach((e, i) => {
    console.log(`   Err ${i+1}: ${e.err} (Math: "${e.math}")`);
  });
});

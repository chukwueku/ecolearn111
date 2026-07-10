import fs from 'fs';
const text = fs.readFileSync('src/lib/advancedStudyData.ts', 'utf8');

console.time('cleanMarkdownContent');
const cleanMarkdownContent = (text) => {
  if (!text) return text;
  
  // 1. Fix control character backslash escaping issues
  let cleaned = text
    .replace(/\x08/g, '\\b')
    .replace(/\x0c/g, '\\f')
    .replace(/\x09/g, '\\t');

  // 1b. Fix React style attributes like style={{ maxHeight: '400px' }} in raw HTML inside markdown
  cleaned = cleaned.replace(/style=\{\{\s*maxHeight\s*:\s*['"]([^'"]+)['"]\s*\}\}/gi, 'style="max-height: $1;"');
  cleaned = cleaned.replace(/style=\{\{\s*maxHeight\s*:\s*([^}\s]+)\s*\}\}/gi, 'style="max-height: $1;"');
  
  // 1c. Replace React className with standard HTML class inside tags to prevent rehype-raw / react-markdown errors
  cleaned = cleaned.replace(/(<[a-z0-9]+\s+[^>]*?\b)className=/gi, '$1class=');
    
  // 2. Ensure a blank line before markdown tables (lines starting with '|')
  const lines = cleaned.split('\n');
  const processedLines = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    
    if (trimmed.startsWith('|')) {
      if (i > 0) {
        const prevLine = processedLines[processedLines.length - 1];
        const prevTrimmed = prevLine.trim();
        if (prevTrimmed !== '' && !prevTrimmed.startsWith('|') && !prevTrimmed.startsWith('<!--')) {
          processedLines.push('');
        }
      }
    }
    processedLines.push(line);
  }
  
  return processedLines.join('\n');
};

cleanMarkdownContent(text);
console.timeEnd('cleanMarkdownContent');

import fs from 'fs';

const textStr = fs.readFileSync('src/lib/advancedStudyData.ts', 'utf8');
const text = textStr.substring(textStr.indexOf('`') + 1, textStr.lastIndexOf('`'));

const content = text;

console.time('split by ---');
let items = content.split(/(?:^|\n)\s*---\s*(?:\n|$)/);
items = items.map(p => p.trim()).filter(p => p.length > 0);
console.timeEnd('split by ---');

if (items.length <= 1) {
  console.time('split by ##');
  const headingPages: string[] = [];
  const lines = content.split('\n');
  let currentPart: string[] = [];
  for (const line of lines) {
    if (line.trim().startsWith('## ') && currentPart.length > 0) {
      headingPages.push(currentPart.join('\n'));
      currentPart = [line];
    } else {
      currentPart.push(line);
    }
  }
  if (currentPart.length > 0) {
    headingPages.push(currentPart.join('\n'));
  }
  if (headingPages.length > 1) {
    items = headingPages;
  }
  console.timeEnd('split by ##');
}

console.log("Pages:", items.length);

console.time('headingsRegex');
const extracted: { level: number; text: string; id: string; pageIndex: number }[] = [];
items.forEach((pageContent, pageIndex) => {
  const pageHeadingRegex = /^(#{1,3})\s+(.+)$/gm;
  let match;
  while ((match = pageHeadingRegex.exec(pageContent)) !== null) {
    const level = match[1].length;
    const text = match[2];
    const id = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
    extracted.push({ level, text, id, pageIndex });
  }
});
console.timeEnd('headingsRegex');
console.log("Extracted headings:", extracted.length);


import fs from 'fs';

const text = fs.readFileSync('src/lib/advancedStudyData.ts', 'utf8');
const regex = /(?:^|\n)\s*---\s*(?:\n|$)/;
const items = text.split(regex).map(p => p.trim()).filter(p => p.length > 0);
let count = 0;
items.forEach(p => {
  const pageHeadingRegex = /^(#{1,3})\s+(.+)$/gm;
  while (pageHeadingRegex.exec(p) !== null) count++;
});
console.log("Total headings:", count);

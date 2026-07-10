import fs from 'fs';

const text = fs.readFileSync('src/lib/advancedStudyData.ts', 'utf8');
const regex = /(?:^|\n)\s*---\s*(?:\n|$)/;
const items = text.split(regex).map(p => p.trim()).filter(p => p.length > 0);
console.log("Number of pages:", items.length);
console.log("Length of page 0:", items[0].length);
console.log("Length of page 1:", items[1].length);

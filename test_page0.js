import fs from 'fs';

const text = fs.readFileSync('src/lib/advancedStudyData.ts', 'utf8');
const regex = /(?:^|\n)\s*---\s*(?:\n|$)/;
const items = text.split(regex).map(p => p.trim()).filter(p => p.length > 0);
console.log(items[0].substring(0, 1000));

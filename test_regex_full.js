import fs from 'fs';
const text = fs.readFileSync('src/lib/advancedStudyData.ts', 'utf8');
console.time('regex 1c full');
const cleaned = text.replace(/(<[a-z0-9]+\s+[^>]*?\b)className=/gi, '$1class=');
console.timeEnd('regex 1c full');

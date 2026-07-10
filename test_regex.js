import fs from 'fs';
const text = fs.readFileSync('src/lib/advancedStudyData.ts', 'utf8');
const textToTest = text.substring(0, 100000); // Test on a chunk
console.time('regex 1c');
const cleaned = textToTest.replace(/(<[a-z0-9]+\s+[^>]*?\b)className=/gi, '$1class=');
console.timeEnd('regex 1c');

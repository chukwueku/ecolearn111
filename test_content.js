import fs from 'fs';
const textStr = fs.readFileSync('src/lib/advancedStudyData.ts', 'utf8');
const text = textStr.substring(textStr.indexOf('`') + 1, textStr.lastIndexOf('`'));
const firstBreak = text.indexOf('---');
console.log("First break at:", firstBreak);
if (firstBreak > -1) {
  console.log("Context around first break:\n", text.substring(firstBreak - 100, firstBreak + 100));
}

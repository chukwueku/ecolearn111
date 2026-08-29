const fs = require('fs');

let content = fs.readFileSync('src/components/StudyGuide.tsx', 'utf8');

const lines = content.split('\n');
let newLines = [];
let skip = false;

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('// Preprocess LaTeX delimiters')) {
    skip = true;
  }
  if (skip && lines[i].includes('  return (tree: any) => {')) {
    skip = false;
    newLines.push('const rehypeMathMarker = () => {');
    newLines.push(lines[i]);
    continue;
  }
  if (!skip) {
    newLines.push(lines[i]);
  }
}

let fixedContent = newLines.join('\n');

const preprocessFunc = `
// Preprocess LaTeX delimiters so remark-math can parse them
const preprocessLaTeX = (text: string) => {
  if (!text) return '';
  return text
    .replace(/\\\\\\[/g, '$$$$')
    .replace(/\\\\\\]/g, '$$$$')
    .replace(/\\\\\(/g, '$')
    .replace(/\\\\\)/g, '$')
    .replace(/\\\[/g, '$$$$')
    .replace(/\\\]/g, '$$$$')
    .replace(/\\\(/g, '$')
    .replace(/\\\)/g, '$');
};
`;

fixedContent = fixedContent.replace("const rehypeMathMarker = () => {", preprocessFunc.replace(/\$/g, '$$$$') + "\nconst rehypeMathMarker = () => {");

fs.writeFileSync('src/components/StudyGuide.tsx', fixedContent, 'utf8');
console.log('Fixed StudyGuide.tsx');

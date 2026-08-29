const fs = require('fs');
let content = fs.readFileSync('src/components/StudyGuide.tsx', 'utf8');

const correctPreprocess = `
const preprocessLaTeX = (text: string) => {
  if (!text) return '';
  return text
    .replace(/\\\\\\[/g, '$$$$$$$$')
    .replace(/\\\\\\]/g, '$$$$$$$$')
    .replace(/\\\\\\(/g, '$$$$')
    .replace(/\\\\\\)/g, '$$$$')
    .replace(/\\\[/g, '$$$$$$$$')
    .replace(/\\\]/g, '$$$$$$$$')
    .replace(/\\\(/g, '$$$$')
    .replace(/\\\)/g, '$$$$');
};
`;

const regex = /const preprocessLaTeX = [\s\S]*?;\n/;
content = content.replace(regex, correctPreprocess);
fs.writeFileSync('src/components/StudyGuide.tsx', content, 'utf8');

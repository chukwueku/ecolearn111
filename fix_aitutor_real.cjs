const fs = require('fs');
let content = fs.readFileSync('src/components/AiTutor.tsx', 'utf8');

const correctClean = `
const cleanMarkdownContent = (text: string) => {
  if (!text) return text;
  let cleaned = text.replace(/\\$(\\s*\\d[\\d,.]*)/g, '\\$$$$1');
  cleaned = cleaned.replace(/\\\\\\[/g, '$$$$').replace(/\\\\\\]/g, '$$$$').replace(/\\\[/g, '$$$$').replace(/\\\]/g, '$$$$');
  cleaned = cleaned.replace(/\\\\\\(/g, '$$').replace(/\\\\\\)/g, '$$').replace(/\\\(/g, '$$').replace(/\\\)/g, '$$');
  return cleaned;
};
`;

const regex = /const cleanMarkdownContent = \([\s\S]*?};\n/;
content = content.replace(regex, () => correctClean);
fs.writeFileSync('src/components/AiTutor.tsx', content, 'utf8');
console.log('Fixed AiTutor.tsx');

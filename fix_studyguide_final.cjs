const fs = require('fs');
let content = fs.readFileSync('src/components/StudyGuide.tsx', 'utf8');

const preprocessFunc = `
// Preprocess LaTeX delimiters so remark-math can parse them
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

// use a function for replacement to avoid $ issues
content = content.replace("const rehypeMathMarker = () => {", () => preprocessFunc.replace(/\$/g, '$$') + "\nconst rehypeMathMarker = () => {");
content = content.replace(/{markdown}/g, "{preprocessLaTeX(markdown)}");
content = content.replace(/{module\.content}/g, "{preprocessLaTeX(module.content)}");

fs.writeFileSync('src/components/StudyGuide.tsx', content, 'utf8');
console.log('Fixed StudyGuide.tsx');

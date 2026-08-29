const fs = require('fs');
let content = fs.readFileSync('src/components/AiTutor.tsx', 'utf8');

content = content.replace(
  "cleaned = cleaned.replace(/\\\\\\[/g, '$$$$').replace(/\\\\\\]/g, '$$$$');", 
  "cleaned = cleaned.replace(/\\\\\\\\\\[/g, '$$$$').replace(/\\\\\\\\\\]/g, '$$$$').replace(/\\\\\\[/g, '$$$$').replace(/\\\\\\]/g, '$$$$');"
);
content = content.replace(
  "cleaned = cleaned.replace(/\\\\\\(/g, '$').replace(/\\\\\\)/g, '$');",
  "cleaned = cleaned.replace(/\\\\\\\\\\(/g, '$').replace(/\\\\\\\\\\)/g, '$').replace(/\\\\\\(/g, '$').replace(/\\\\\\)/g, '$');"
);

fs.writeFileSync('src/components/AiTutor.tsx', content, 'utf8');
console.log('Fixed AiTutor.tsx');

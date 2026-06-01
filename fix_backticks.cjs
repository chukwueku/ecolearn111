const fs = require('fs');
const targetFile = 'src/lib/advancedStudyData.ts';
let content = fs.readFileSync(targetFile, 'utf8');

// Replace the literal \` with a normal backtick `
const newContent = content.replace(/"ug-statistical": \\`/g, '"ug-statistical": `').replace(/\\`\n};\n$/g, '`\n};\n');
fs.writeFileSync(targetFile, newContent);
console.log('Fixed backticks!');

const fs = require('fs');

let content = fs.readFileSync('src/lib/advancedStudyData.ts', 'utf8');

content = content.replace(/(?<!\\)\\([a-zA-Z]+)/g, (match, p1) => {
    return '\\\\' + p1;
});

content = content.replace(/(?<!\\)\\([{}\[\]])/g, '\\\\$1');

fs.writeFileSync('src/lib/advancedStudyData.ts', content);
console.log('Fixed latex backslashes');

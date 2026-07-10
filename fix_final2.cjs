const fs = require('fs');
let content = fs.readFileSync('src/lib/advancedStudyData.ts', 'utf8');

const macros = ['beta', 'hat', 'sigma', 'alpha', 'sum', 'ln', 'exp', 'Delta', 'text', 'frac', 'quad', 'dots', 'sim', 'chi'];

macros.forEach(macro => {
    // Replace 4 backslashes with 2 backslashes
    const regex = new RegExp(`\\\\\\\\\\\\\\\\(?=${macro})`, 'g');
    content = content.replace(regex, '\\\\');
});

fs.writeFileSync('src/lib/advancedStudyData.ts', content);
console.log("Fixed final backslashes for real.");

const fs = require('fs');

let content = fs.readFileSync('src/components/StudyGuide.tsx', 'utf8');

// Replace the mangled part
const mangledRegex = /const preprocessLaTeX = \([\s\S]*?\.replace\(\/\\\\\\\( \/g, '/;
content = content.replace(mangledRegex, "");
// Wait, I need to be precise.

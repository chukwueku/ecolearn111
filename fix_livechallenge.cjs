const fs = require('fs');
let content = fs.readFileSync('src/components/LiveChallenge.tsx', 'utf8');

// Add MathText import
content = content.replace("import { motion, AnimatePresence } from 'motion/react';", "import { motion, AnimatePresence } from 'motion/react';\nimport { MathText } from './MathComponents';");

// Replace {q.question} with <MathText text={q.question} />
content = content.replace(/{q\.question}/g, "<MathText text={q.question} />");
content = content.replace(/{currentQ\.question}/g, "<MathText text={currentQ.question} />");
content = content.replace(/{opt}/g, "<MathText text={opt} />");
content = content.replace(/{q\.explanation}/g, "<MathText text={q.explanation} />");
content = content.replace(/{currentQ\.explanation}/g, "<MathText text={currentQ.explanation} />");

fs.writeFileSync('src/components/LiveChallenge.tsx', content, 'utf8');
console.log('Fixed LiveChallenge.tsx');

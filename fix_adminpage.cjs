const fs = require('fs');
let content = fs.readFileSync('src/components/AdminPage.tsx', 'utf8');

// Ensure MathText is imported in AdminPage.tsx
if (!content.includes("import { MathText }")) {
  content = content.replace("import { motion, AnimatePresence } from 'motion/react';", "import { motion, AnimatePresence } from 'motion/react';\nimport { MathText } from './MathComponents';");
}

content = content.replace(/<span className="mr-1\.5 opacity-60">\{String\.fromCharCode\(65 \+ oIdx\)\}\.<\/span> \{opt\}/g, '<span className="mr-1.5 opacity-60">{String.fromCharCode(65 + oIdx)}.</span> <MathText text={opt} />');
content = content.replace(/>\s*\{opt\}\s*<\/div>/g, '> <MathText text={opt} /> </div>');

// also replace {q.question} with MathText when it's not in an input
content = content.replace(/<p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2">\{q\.question\}<\/p>/g, '<p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2"><MathText text={q.question} /></p>');
content = content.replace(/<h4 className="font-semibold text-slate-800 dark:text-white mb-2 leading-relaxed">\{q\.question\}<\/h4>/g, '<h4 className="font-semibold text-slate-800 dark:text-white mb-2 leading-relaxed"><MathText text={q.question} /></h4>');

fs.writeFileSync('src/components/AdminPage.tsx', content, 'utf8');
console.log('Fixed AdminPage.tsx');

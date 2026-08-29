const fs = require('fs');

let content = fs.readFileSync('src/components/ChapterQuiz.tsx', 'utf8');

// Strip out the ReactMarkdown imports and the renderMarkdown function I added.
content = content.replace("import ReactMarkdown from 'react-markdown';\nimport remarkMath from 'remark-math';\nimport remarkGfm from 'remark-gfm';\nimport rehypeKatex from 'rehype-katex';\nimport rehypeRaw from 'rehype-raw';", "import { MathText } from './MathComponents';");

const mdRendererRegex = /const renderMarkdown = [\s\S]*?;\n/g;
content = content.replace(mdRendererRegex, "");

// Replace {renderMarkdown(...)} with <MathText text={...} />
content = content.replace(/{renderMarkdown\((.*?)\|\| ''\)}/g, "<MathText text={$1 || ''} />");
content = content.replace(/{renderMarkdown\((.*?)\)}/g, "<MathText text={$1} />");

fs.writeFileSync('src/components/ChapterQuiz.tsx', content, 'utf8');
console.log('Updated ChapterQuiz.tsx to use MathText');

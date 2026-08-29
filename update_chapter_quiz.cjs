const fs = require('fs');

let content = fs.readFileSync('src/components/ChapterQuiz.tsx', 'utf8');

const imports = `import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
`;

content = content.replace("import React, { useState, useEffect, useCallback } from 'react';", "import React, { useState, useEffect, useCallback } from 'react';\n" + imports);

const mdRenderer = `
const renderMarkdown = (text: string) => (
  <ReactMarkdown
    remarkPlugins={[remarkMath, remarkGfm]}
    rehypePlugins={[rehypeRaw, rehypeKatex]}
    components={{
      p: ({ node, ...props }) => <span {...props} />,
    }}
  >
    {text}
  </ReactMarkdown>
);
`;

content = content.replace("interface ChapterQuizProps {", mdRenderer + "\ninterface ChapterQuizProps {");

// Replace {questions[currentQ]?.question} with {renderMarkdown(questions[currentQ]?.question || '')}
content = content.replace(
  "{questions[currentQ]?.question}",
  "{renderMarkdown(questions[currentQ]?.question || '')}"
);

// Replace {opt} with {renderMarkdown(opt)}
content = content.replace(
  /<span className="text-slate-700 dark:text-slate-200">{opt}<\/span>/g,
  `<span className="text-slate-700 dark:text-slate-200">{renderMarkdown(opt)}</span>`
);

// Replace explanation
content = content.replace(
  "{questions[currentQ].explanation}",
  "{renderMarkdown(questions[currentQ].explanation)}"
);

// Also the review screen: {q.question}
content = content.replace(
  "{q.question}",
  "{renderMarkdown(q.question)}"
);

fs.writeFileSync('src/components/ChapterQuiz.tsx', content, 'utf8');
console.log('Updated ChapterQuiz.tsx');

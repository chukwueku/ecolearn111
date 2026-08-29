import React from 'react';
import katex from 'katex';

interface MathProps {
  math: string;
}

export const InlineMath: React.FC<MathProps> = ({ math }) => {
  try {
    const html = katex.renderToString(math, {
      displayMode: false,
      throwOnError: false,
      errorColor: '#475569', // Muted slate color instead of bright red (#cc0000)
    });
    return <span className="inline-math" dangerouslySetInnerHTML={{ __html: html }} />;
  } catch (error) {
    return <span className="font-mono text-xs px-1 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-slate-700 dark:text-slate-300">{math}</span>;
  }
};

export const BlockMath: React.FC<MathProps> = ({ math }) => {
  try {
    const html = katex.renderToString(math, {
      displayMode: true,
      throwOnError: false,
      errorColor: '#475569', // Muted slate color instead of bright red (#cc0000)
    });
    return <div className="block-math overflow-x-auto py-3 flex justify-center w-full my-2 bg-slate-500/5 dark:bg-slate-900/30 rounded-xl p-3 border border-border/50" dangerouslySetInnerHTML={{ __html: html }} />;
  } catch (error) {
    return <div className="overflow-x-auto py-2 font-mono text-xs text-center w-full bg-slate-100 dark:bg-slate-800 rounded p-2 text-slate-700 dark:text-slate-300">{math}</div>;
  }
};

interface MathTextProps {
  text: string;
}

export const MathText: React.FC<MathTextProps> = ({ text }) => {
  if (!text) return null;

  // 1. Protect currency signs like $100, $50, $1,000, $10.50 so they don't trigger math parser
  // Matches $ followed by digits (e.g. $100 or $ 50)
  const currencyPlaceholder = '___CURRENCY_DOLLAR___';
  let processedText = text.replace(/\$(\s*\d[\d,.]*)/g, `${currencyPlaceholder}$1`);

  // 2. Normalize LaTeX delimiters while preserving \\ linebreaks inside formulas
  processedText = processedText
    .replace(/\\\\\[/g, '$$$$')
    .replace(/\\\\\]/g, '$$$$')
    .replace(/\\\[/g, '$$$$')
    .replace(/\\\]/g, '$$$$')
    .replace(/\\\\\(/g, '\\(')
    .replace(/\\\\\)/g, '\\)');

  // 3. Regex to match $$...$$ or $...$ or \(...\)
  const regex = /(\$\$[\s\S]*?\$\$|\$[^$\n]+?\$|\\\([\s\S]*?\\\))/g;
  const tokens = processedText.split(regex);

  const parts: React.ReactNode[] = [];

  tokens.forEach((token, index) => {
    if (!token) return;

    // Restore currency signs in text parts
    const restoredToken = token.replace(new RegExp(currencyPlaceholder, 'g'), '$');

    if (token.startsWith('$$') && token.endsWith('$$')) {
      const math = restoredToken.slice(2, -2).trim();
      parts.push(<BlockMath key={index} math={math} />);
    } else if (token.startsWith('$') && token.endsWith('$')) {
      const math = restoredToken.slice(1, -1).trim();
      // Verify if it looks like actual math vs text containing single dollar
      if (math.length > 0 && !/^\s*\d+[\d,.]*\s*$/.test(math)) {
        parts.push(<InlineMath key={index} math={math} />);
      } else {
        parts.push(<span key={index}>{`$${math}$`}</span>);
      }
    } else if (token.startsWith('\\(') && token.endsWith('\\)')) {
      const math = restoredToken.slice(2, -2).trim();
      parts.push(<InlineMath key={index} math={math} />);
    } else {
      const lines = restoredToken.split('\n');
      lines.forEach((line, lineIdx) => {
        if (lineIdx > 0) {
          parts.push(<br key={`br-${index}-${lineIdx}`} />);
        }
        parts.push(<span key={`text-${index}-${lineIdx}`}>{line}</span>);
      });
    }
  });

  return <span className="leading-relaxed whitespace-pre-line">{parts}</span>;
};

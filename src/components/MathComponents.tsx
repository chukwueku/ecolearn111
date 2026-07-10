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
    });
    return <span dangerouslySetInnerHTML={{ __html: html }} />;
  } catch (error) {
    return <span className="font-mono">{math}</span>;
  }
};

export const BlockMath: React.FC<MathProps> = ({ math }) => {
  try {
    const html = katex.renderToString(math, {
      displayMode: true,
      throwOnError: false,
    });
    return <div className="overflow-x-auto py-2 flex justify-center w-full" dangerouslySetInnerHTML={{ __html: html }} />;
  } catch (error) {
    return <div className="overflow-x-auto py-2 font-mono text-center w-full">{math}</div>;
  }
};

interface MathTextProps {
  text: string;
}

export const MathText: React.FC<MathTextProps> = ({ text }) => {
  if (!text) return null;

  // Normalize backslashes and delimiters to make parsing highly resilient
  let processedText = text
    .replace(/\\\\/g, '\\') // Unescape double backslashes to single backslashes
    .replace(/\\\[/g, '$$$$') // Convert \[ to $$
    .replace(/\\\]/g, '$$$$') // Convert \] to $$
    .replace(/\\\(/g, '\\(') // Ensure single escaped \(
    .replace(/\\\)/g, '\\)'); // Ensure single escaped \)

  // Regex to match $$...$$ or $...$ or \(...\)
  const regex = /(\$\$[\s\S]*?\$\$|\$[^$\n]+?\$|\\\([\s\S]*?\\\))/g;
  const tokens = processedText.split(regex);

  const parts: React.ReactNode[] = [];

  tokens.forEach((token, index) => {
    if (!token) return;

    if (token.startsWith('$$') && token.endsWith('$$')) {
      const math = token.slice(2, -2).trim();
      parts.push(<BlockMath key={index} math={math} />);
    } else if (token.startsWith('$') && token.endsWith('$')) {
      const math = token.slice(1, -1).trim();
      parts.push(<InlineMath key={index} math={math} />);
    } else if (token.startsWith('\\(') && token.endsWith('\\)')) {
      const math = token.slice(2, -2).trim();
      parts.push(<InlineMath key={index} math={math} />);
    } else {
      const lines = token.split('\n');
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

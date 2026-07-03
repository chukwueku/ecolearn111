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

import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import { renderToString } from 'react-dom/server';
import React from 'react';

const markdownText = 'given a utility function \\( U(x,y) = x^\\alpha y^{1-\\alpha} \\)';
console.log(renderToString(React.createElement(ReactMarkdown, {
  remarkPlugins: [remarkMath, remarkGfm],
  rehypePlugins: [rehypeRaw, rehypeKatex],
  children: markdownText
})));

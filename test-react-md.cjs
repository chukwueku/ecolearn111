const Markdown = require('react-markdown');
const remarkMath = require('remark-math');
const rehypeKatex = require('rehype-katex');
const { renderToStaticMarkup } = require('react-dom/server');
const React = require('react');

const text1 = `$\\hat{\\beta}$`; // evaluates to `$\hat{\beta}$` in JS, which means `$hat{\eta}$` with backspace
const text2 = `$\\\\hat{\\\\beta}$`; // evaluates to `$\\hat{\\beta}$` in JS
const text3 = `$\\\\\\\\hat{\\\\\\\\beta}$`; // evaluates to `$\\\\hat{\\\\beta}$` in JS

function render(text) {
    const el = React.createElement(Markdown, {
        remarkPlugins: [remarkMath],
        rehypePlugins: [rehypeKatex],
    }, text);
    return renderToStaticMarkup(el);
}

try { console.log("text1:", render(text1)); } catch (e) { console.log("text1 error", e.message); }
try { console.log("text2:", render(text2)); } catch (e) { console.log("text2 error", e.message); }
try { console.log("text3:", render(text3)); } catch (e) { console.log("text3 error", e.message); }

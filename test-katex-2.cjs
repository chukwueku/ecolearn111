const katex = require('katex');

// 1. If source file has "\\hat{\\beta}" inside a template literal
const str1 = `\\hat{\\beta}`;
console.log("str1 (literal `\\\\hat{\\\\beta}`):", str1);
try { console.log(katex.renderToString(str1)); } catch (e) { console.log("error"); }

// 2. If source file has "\\\\hat{\\\\beta}" inside a template literal
const str2 = `\\\\hat{\\\\beta}`;
console.log("\nstr2 (literal `\\\\\\\\hat{\\\\\\\\beta}`):", str2);
try { console.log(katex.renderToString(str2)); } catch (e) { console.log("error"); }

// 3. What if it's evaluated by React-Markdown's remark-math?

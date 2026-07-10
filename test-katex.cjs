const katex = require('katex');
try {
  console.log("2 backslashes:", katex.renderToString("\\\\hat{\\\\beta}"));
} catch (e) { console.log(e.message); }
try {
  console.log("1 backslash:", katex.renderToString("\\hat{\\beta}"));
} catch (e) { console.log(e.message); }

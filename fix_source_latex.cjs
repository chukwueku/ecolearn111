const fs = require('fs');

let content = fs.readFileSync('src/lib/advancedStudyData.ts', 'utf8');

// Fix specific broken LaTeX strings in advancedStudyData.ts
content = content.replace(/\$Y = AK\^\\ N\^\{1-\\\}\$/g, '$Y = A K^{\\alpha} N^{1-\\alpha}$');
content = content.replace(/y_t = y_\{t-1\} \+ \\$/g, 'y_t = y_{t-1} + \\epsilon_t');
content = content.replace(/P_i = \\left\(\\frac\{\\}\\{\\ - 1\}\\right\) \\frac\{W\}\{a\}/g, 'P_i = \\left(\\frac{\\eta}{\\eta - 1}\\right) \\frac{W}{a}');
content = content.replace(/\\Delta R = \\/g, '\\Delta R = \\text{Change in Reserves}');

// Fix table header ($B) -> (USD $B)
content = content.replace(/Value \(\$B\)/g, 'Value (USD $B)');

fs.writeFileSync('src/lib/advancedStudyData.ts', content, 'utf8');
console.log('Fixed source LaTeX anomalies in advancedStudyData.ts');

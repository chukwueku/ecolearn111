const fs = require('fs');
let content = fs.readFileSync('src/lib/advancedStudyData.ts', 'utf8');

// The file currently has \\\\ for LaTeX macros because I ran fix_latex_escapes.cjs TWICE on it (or it already had \\ and I doubled it).
// Wait, if it has \\\\hat, let's replace all \\\\ with \\ for these macros.
const macros = ['beta', 'hat', 'sigma', 'alpha', 'sum', 'ln', 'exp', 'Delta', 'text', 'frac', 'quad', 'dots', 'sim', 'chi'];

macros.forEach(macro => {
    // Replace \\\\macro with \\macro
    const regex = new RegExp(`\\\\\\\\(?=${macro})`, 'g');
    content = content.replace(regex, '\\\\');
});

fs.writeFileSync('src/lib/advancedStudyData.ts', content);
console.log("Fixed final backslashes.");

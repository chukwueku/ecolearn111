import * as fs from 'fs';

let content = fs.readFileSync('src/lib/advancedStudyData.ts', 'utf8');

const keywords = ['frac', 'times', 'cdot', 'sum', 'infty', 'sigma', 'beta', 'text', 'left', 'right', 'approx', 'implies', 'ln', 'sqrt'];
for (const kw of keywords) {
    const rx = new RegExp('(?<!\\\\)\\\\' + kw, 'g');
    content = content.replace(rx, '\\\\\\' + kw);
}
fs.writeFileSync('src/lib/advancedStudyData.ts', content);

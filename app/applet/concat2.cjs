const fs = require('fs');
const files = fs.readdirSync('.').filter(f => f.startsWith('development_economics_') && f.endsWith('.md'));
files.sort((a, b) => {
    const numA = parseInt(a.replace('development_economics_', '').replace('.md', ''), 10);
    const numB = parseInt(b.replace('development_economics_', '').replace('.md', ''), 10);
    return numA - numB;
});

let out = '# Development Economics by Debraj Ray - Study Guide\n\n';
for (const f of files) {
    out += fs.readFileSync(f, 'utf8') + '\n\n---\n\n';
}

fs.writeFileSync('development_economics.md', out);
console.log('Concatenated ' + files.length + ' parts into development_economics.md');

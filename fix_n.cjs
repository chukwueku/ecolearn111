const fs = require('fs');
const target = 'src/lib/advancedStudyData.ts';
let c = fs.readFileSync(target, 'utf8');
c = c.replace(/\\n`\\n\};\n/g, '\n`\n};\n');
fs.writeFileSync(target, c);

const fs = require('fs');
let content = fs.readFileSync('src/constants.ts', 'utf8');

// Find the start of UNDERGRADUATE_REAL_ROADMAP
const startIndex = content.indexOf('export const UNDERGRADUATE_REAL_ROADMAP');
if (startIndex !== -1) {
  let before = content.substring(0, startIndex);
  let after = content.substring(startIndex);
  after = after.replace(/category: 'Chapter /g, "category: 'Course ");
  fs.writeFileSync('src/constants.ts', before + after);
  console.log("Updated UNDERGRADUATE_REAL_ROADMAP to use 'Course'");
}

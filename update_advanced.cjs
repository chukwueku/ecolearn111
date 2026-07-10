const fs = require('fs');

let chaptersStr = fs.readFileSync('src/lib/econometricsChapters.ts', 'utf8');
let advancedStr = fs.readFileSync('src/lib/advancedStudyData.ts', 'utf8');

// Just some simple string manipulation to remove the dummy text and add real bullet points.
// But wait, the bullet points are in econometricsChapters.ts.
// It's easier to just use the actual headings to generate some varied text.

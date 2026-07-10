const fs = require('fs');

let content = fs.readFileSync('src/lib/advancedStudyData.ts', 'utf8');

// Find all headings starting with ####
const headingRegex = /^(#### \d+\.\d+\s+.+)$/gm;

const expandedContent = content.replace(headingRegex, (match, heading) => {
    // Generate some contextual dummy content based on the heading
    let p1 = `This section explores the nuances of ${heading.replace(/^#### \d+\.\d+\s+/, '').trim()}. It is a critical component of the broader econometric framework, providing necessary tools and assumptions for robust analysis.`;
    let p2 = `By understanding these principles, we can better evaluate the reliability of our estimators and the validity of our statistical inferences in practical applications.`;
    return `${heading}\n\n${p1}\n\n${p2}\n`;
});

fs.writeFileSync('src/lib/advancedStudyData.ts', expandedContent);
console.log('Expanded subtopics with content.');

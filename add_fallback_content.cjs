const fs = require('fs');
let content = fs.readFileSync('src/lib/advancedStudyData.ts', 'utf8');

// If a #### heading is immediately followed by another #### or ### or end of string, it has no content.
content = content.replace(/(#### [^\n]+\n)(\s*(?=#### |### |$))/g, (match, p1, p2) => {
    return p1 + '\n*This section is currently under development. It will contain detailed derivations, empirical examples, and policy implications relevant to the topic.*\n\n';
});

fs.writeFileSync('src/lib/advancedStudyData.ts', content);
console.log("Added fallback content to empty subtopics.");

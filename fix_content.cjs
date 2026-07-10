const fs = require('fs');
const { ECONOMETRICS_CHAPTERS } = require('./temp_chapters.cjs');

let content = fs.readFileSync('src/lib/advancedStudyData.ts', 'utf8');

for (const chapter of ECONOMETRICS_CHAPTERS) {
    if (!chapter.subtopics) continue;
    
    for (const [topicName, bullets] of Object.entries(chapter.subtopics)) {
        const matchNumber = topicName.match(/^(\d+\.\d+)/);
        if (matchNumber) {
            const num = matchNumber[1];
            
            // Reconstruct the correct bullet text without the string replacement bug
            let bulletText = '\n\n' + bullets.map(b => `- ${b}`).join('\n') + '\n';
            
            // Find the heading in the content. It might be immediately followed by corrupted bullets or another heading.
            // Let's use a regex that matches `#### 4.1 ...` and everything up to the next `#### ` or `### ` or end of string.
            const regex = new RegExp(`(#### ${num}[^\\n]*\\n)([\\s\\S]*?)(?=#### |### |$)`, 'g');
            
            content = content.replace(regex, (match, p1) => {
                return p1 + bulletText;
            });
        }
    }
}

fs.writeFileSync('src/lib/advancedStudyData.ts', content);
console.log("Fixed corrupted content.");

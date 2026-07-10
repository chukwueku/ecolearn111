const fs = require('fs');
const { ECONOMETRICS_CHAPTERS } = require('./temp_chapters.cjs');

let content = fs.readFileSync('src/lib/advancedStudyData.ts', 'utf8');

// First, let's remove the dummy text completely.
const dummyRegex = /This section explores the nuances of.*?\n\nBy understanding these principles,.*?\.\n/g;
content = content.replace(dummyRegex, '');

// Now we need to insert the bullet points from ECONOMETRICS_CHAPTERS under each heading.
// A heading looks like: #### 4.1 The Probability Distribution of Disturbances $u_i$

for (const chapter of ECONOMETRICS_CHAPTERS) {
    if (!chapter.subtopics) continue;
    
    for (const [topicName, bullets] of Object.entries(chapter.subtopics)) {
        // Find the exact heading or something very similar.
        // The heading might be something like: #### 4.1 The Probability Distribution of Disturbances $u_i$
        // The topicName from ECONOMETRICS_CHAPTERS is something like: "4.1 The Probability Distribution of u_i"
        
        // Let's create a regex to find the heading. We'll match the start of the topic name (e.g. "4.1").
        const matchNumber = topicName.match(/^(\d+\.\d+)/);
        if (matchNumber) {
            const num = matchNumber[1];
            // Look for `#### 4.1 ...`
            const headingRegex = new RegExp(`(#### ${num}[^\\n]*)`, 'g');
            
            // Format the bullets
            let bulletText = '\n\n' + bullets.map(b => `- ${b}`).join('\n') + '\n';
            
            content = content.replace(headingRegex, `$1${bulletText}`);
        }
    }
}

fs.writeFileSync('src/lib/advancedStudyData.ts', content);
console.log("Done injecting.");

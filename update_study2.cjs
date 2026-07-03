const fs = require('fs');
let content = fs.readFileSync('src/components/StudyGuide.tsx', 'utf8');

content = content.replace(
  '<option key={ch.id} value={ch.id}>{ch.category}: {ch.title}</option>',
  '<option key={ch.id} value={ch.id}>{profile?.level === "undergraduate" ? ch.title : `${ch.category}: ${ch.title}`}</option>'
);

fs.writeFileSync('src/components/StudyGuide.tsx', content);

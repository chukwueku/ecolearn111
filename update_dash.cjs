const fs = require('fs');
let content = fs.readFileSync('src/components/Dashboard.tsx', 'utf8');

// Replace category text
content = content.replace(
  '{topic.category || `Chapter ${index + 1}`}',
  '{level === "undergraduate" ? `Course ${index + 1}` : (topic.category || `Chapter ${index + 1}`)}'
);

fs.writeFileSync('src/components/Dashboard.tsx', content);

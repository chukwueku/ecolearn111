const fs = require('fs');
let content = fs.readFileSync('src/components/StudyGuide.tsx', 'utf8');

content = content.replace(
  '<p className="text-[10px] font-bold uppercase tracking-[0.2em] text-sky-600 dark:text-sky-400 mb-8">Topics</p>',
  '<p className="text-[10px] font-bold uppercase tracking-[0.2em] text-sky-600 dark:text-sky-400 mb-8">{profile?.level === "undergraduate" ? "Switch Course" : "Switch Topic"}</p>'
);

content = content.replace(
  '{ch.category}',
  '{profile?.level === "undergraduate" ? ch.title : ch.category}'
);

content = content.replace(
  '<p className="text-[10px] font-bold uppercase tracking-[0.2em] text-sky-600 dark:text-sky-400 mb-4">Select Topic</p>',
  '<p className="text-[10px] font-bold uppercase tracking-[0.2em] text-sky-600 dark:text-sky-400 mb-4">{profile?.level === "undergraduate" ? "Switch Course" : "Select Topic"}</p>'
);

fs.writeFileSync('src/components/StudyGuide.tsx', content);

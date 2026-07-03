const fs = require('fs');
let content = fs.readFileSync('src/components/StudyGuide.tsx', 'utf8');

// Replace "Topics" in sidebar
content = content.replace(
  '<p className="text-[10px] font-bold uppercase tracking-[0.2em] text-sky-600 dark:text-sky-400 mb-8">Topics</p>',
  '<p className="text-[10px] font-bold uppercase tracking-[0.2em] text-sky-600 dark:text-sky-400 mb-8">{profile?.level === "undergraduate" ? "Courses" : "Topics"}</p>'
);

// We need to import `profile` from useAuth in StudyGuide. Let's see if it's there.

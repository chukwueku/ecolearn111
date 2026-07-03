const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'src/components/LevelSelection.tsx');
let content = fs.readFileSync(file, 'utf8');

// 1. Change navigation target
content = content.replace(
`      if (level === 'secondary') {
        navigate('/study-guide/ss1-ch1');
      } else if (level === 'secondary-ss2') {
        navigate('/study-guide/ss2-ch1');
      } else if (level === 'secondary-ss3') {
        navigate('/study-guide/ug-ch1');
      } else {
        navigate('/study-guide/ug-micro');
      }`,
`      navigate('/'); // Go straight to home for all levels`
);

// 2. Change onClick for Advanced Undergrad Level Roadmap to skip intermediate screen
content = content.replace(
`              {/* Advanced Undergrad Level Roadmap */}
              <div
                onClick={() => setSelectedMainPath('undergraduate')}`,
`              {/* Advanced Undergrad Level Roadmap */}
              <div
                onClick={() => !loading && handleSelectLevel('undergraduate')}`
);

fs.writeFileSync(file, content, 'utf8');
console.log('Fixed LevelSelection.tsx');

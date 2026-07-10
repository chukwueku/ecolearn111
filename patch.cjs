const fs = require('fs');
const path = './src/components/StudyGuide.tsx';
let content = fs.readFileSync(path, 'utf8');

const replacement = `
const retryImport = (fn) => async () => {
  try {
    return await fn();
  } catch (error) {
    if (error.message.includes('fetch dynamically imported module') || error.message.includes('Failed to fetch')) {
      console.warn('Chunk loading failed, reloading window...');
      window.location.reload();
    }
    throw error;
  }
};

const LazyInternationalEconomicsTextbook = React.lazy(retryImport(() => 
  import('./InternationalEconomicsTextbook').then(module => ({ default: module.InternationalEconomicsTextbook }))
));
const LazyEconometricsStudyGuide = React.lazy(retryImport(() => 
  import('./EconometricsStudyGuide').then(module => ({ default: module.EconometricsStudyGuide }))
));
const LazyEconomicsSimulator = React.lazy(retryImport(() => 
  import('./EconomicsSimulator').then(module => ({ default: module.EconomicsSimulator }))
));
`;

content = content.replace(/const LazyInternationalEconomicsTextbook = React\.lazy\(\(\) =>[\s\S]*?module\.EconomicsSimulator \}\)\)\n\);/g, replacement.trim());
content = content.replace(/const LazyInternationalEconomicsTextbook = React\.lazy\(\(\) => \n\s*import\('\.\/InternationalEconomicsTextbook'\)\.then\(module => \(\{ default: module\.InternationalEconomicsTextbook \}\)\)\n\);/g, '');
content = content.replace(/const LazyEconometricsStudyGuide = React\.lazy\(\(\) => \n\s*import\('\.\/EconometricsStudyGuide'\)\.then\(module => \(\{ default: module\.EconometricsStudyGuide \}\)\)\n\);/g, '');
content = content.replace(/const LazyEconomicsSimulator = React\.lazy\(\(\) => \n\s*import\('\.\/EconomicsSimulator'\)\.then\(module => \(\{ default: module\.EconomicsSimulator \}\)\)\n\);/g, '');

fs.writeFileSync(path, content);

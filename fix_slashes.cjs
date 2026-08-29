const fs = require('fs');
const glob = require('glob'); // Not available? I'll use simple readdir

const path = require('path');
function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = dir + '/' + file;
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      results.push(file);
    }
  });
  return results;
}

const files = walk('./src/lib').filter(f => f.endsWith('.ts') || f.endsWith('.tsx'));
let changedFiles = 0;

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  // We need to replace single backslashes with double backslashes for math commands.
  // But ONLY if they are not already double backslashes.
  // Wait, the safest way is to find single backslashes before specific math commands:
  // \alpha, \beta, \gamma, \delta, \epsilon, \zeta, \eta, \theta, \iota, \kappa, \lambda, \mu, \nu, \xi, \pi, \rho, \sigma, \tau, \upsilon, \phi, \chi, \psi, \omega
  // \frac, \sqrt, \times, \div, \pm, \mp, \le, \ge, \neq, \approx, \equiv, \propto
  // \sum, \prod, \int, \oint, \partial, \nabla, \infty, \ell, \Re, \Im
  // \sin, \cos, \tan, \csc, \sec, \cot, \log, \ln, \exp
  // \hat, \bar, \vec, \dot, \ddot
  // \text, \mathbf, \mathcal, \mathbb
  // \left, \right, \langle, \rangle
  // \quad, \qquad
  // \_, \^, \{, \} (Wait, \{ and \} might be single escaped? \{ is just { in template string)
  
  // A regex to match a single backslash followed by a letter, which is NOT preceded by another backslash.
  // /(?<!\\)\\(?=[a-zA-Z])/g
  // Wait, if it's \\\\frac, the first pair is one backslash, the second is another.
  // We should just use a regex for known latex commands that are preceded by an ODD number of backslashes, or just simply replace /(?<!\\)\\(?=[a-zA-Z])/g with \\\\
  
  // Let's test /(?<!\\)\\(?=[a-zA-Z])/g
  const newContent = content.replace(/(?<!\\)\\(?=[a-zA-Z])/g, '\\\\');
  
  if (content !== newContent) {
    fs.writeFileSync(file, newContent, 'utf8');
    changedFiles++;
    console.log('Fixed', file);
  }
}
console.log('Done, changed', changedFiles, 'files');

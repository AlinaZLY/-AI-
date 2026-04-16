const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const run = (cmd) => {
  try {
    return execSync(cmd, { cwd: root, encoding: 'utf8', env: { ...process.env, GIT_PAGER: 'cat' } }).trim();
  } catch (e) {
    return '[ERROR] ' + (e.stderr || e.message);
  }
};

let out = '';
out += '=== STATUS ===\n' + run('git status --short') + '\n\n';
out += '=== DIFF NAMES ===\n' + run('git diff --name-only') + '\n\n';
out += '=== STAGED NAMES ===\n' + run('git diff --cached --name-only') + '\n\n';
out += '=== LOG 5 ===\n' + run('git log --oneline -5') + '\n\n';
out += '=== BRANCH ===\n' + run('git branch --show-current') + '\n';

const outPath = path.join(__dirname, 'git-dump.txt');
fs.writeFileSync(outPath, out, 'utf8');
process.stdout.write('Wrote to ' + outPath + '\n');

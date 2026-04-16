const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const run = (cmd) => execSync(cmd, { cwd: root, encoding: 'utf8', env: { ...process.env, GIT_PAGER: 'cat' } }).trim();

// Export every commit on the current branch
const log = run('git log --reverse --format=%H%x00%aI%x00%an%x00%ae%x00%s');
const lines = log.split('\n').filter(Boolean);
const commits = lines.map(l => {
  const parts = l.split('\0');
  return { hash: parts[0], date: parts[1], author: parts[2], email: parts[3], msg: parts[4] || '' };
});

// Group commits by author
const byAuthor = {};
commits.forEach(c => {
  if (!byAuthor[c.author]) byAuthor[c.author] = { email: c.email, commits: [] };
  byAuthor[c.author].commits.push(c.msg);
});

console.log(`${commits.length} commits found on the current branch\n`);
for (const [name, data] of Object.entries(byAuthor)) {
  console.log(`\n=== ${name} <${data.email}> (${data.commits.length} commits) ===`);
  data.commits.forEach((m, i) => console.log(`  ${i+1}. ${m}`));
}

fs.writeFileSync(path.join(__dirname, 'by-author.json'), JSON.stringify(byAuthor, null, 2), 'utf8');

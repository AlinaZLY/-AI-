#!/usr/bin/env node
/**
 * Runs git filter-branch --msg-filter to translate all commit messages to English.
 * Copies translate files to a simple ASCII temp path to avoid unicode path issues in Git Bash.
 */
'use strict';
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

const ROOT = path.resolve(__dirname, '..');
const TMP = path.join(os.tmpdir(), 'git-translate');

// Setup temp dir with translate files
if (fs.existsSync(TMP)) fs.rmSync(TMP, { recursive: true, force: true });
fs.mkdirSync(TMP, { recursive: true });
fs.copyFileSync(path.join(__dirname, 'translate-msg.js'), path.join(TMP, 'translate-msg.js'));
fs.copyFileSync(path.join(__dirname, 'msg-map.json'), path.join(TMP, 'msg-map.json'));
console.log('Copied translate files to:', TMP);

// Convert Windows path to MSYS2 path: D:\foo\bar → /d/foo/bar
const msys = TMP.replace(/\\/g, '/').replace(/^([A-Za-z]):/, (_, d) => '/' + d.toLowerCase());
const script = msys + '/translate-msg.js';
console.log('MSYS2 script path:', script);

// Build command
const cmd = `git filter-branch -f --msg-filter "node '${script}'" -- --all`;
console.log('\nRunning:', cmd, '\n');

try {
  const out = execSync(cmd, {
    cwd: ROOT,
    encoding: 'utf8',
    stdio: ['pipe', 'pipe', 'pipe'],
    env: { ...process.env, GIT_PAGER: 'cat' },
    maxBuffer: 50 * 1024 * 1024,
    timeout: 300000, // 5 min
  });
  console.log(out);
} catch (e) {
  // filter-branch outputs progress to stderr
  if (e.status === 0 || (e.stderr && e.stderr.includes('Ref'))) {
    console.log(e.stdout || '');
    console.log(e.stderr || '');
  } else {
    console.error('filter-branch failed:');
    console.error(e.stderr || e.message);
    process.exit(1);
  }
}

// Verify
console.log('\n=== Last 25 commits ===');
try {
  console.log(execSync('git log --oneline -25', {
    cwd: ROOT, encoding: 'utf8',
    env: { ...process.env, GIT_PAGER: 'cat' },
  }));
} catch {}

// Cleanup
fs.rmSync(TMP, { recursive: true, force: true });
console.log('Done!');

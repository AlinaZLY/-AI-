#!/usr/bin/env node
// Called by git filter-branch --msg-filter
// Reads commit message from stdin, outputs translated message to stdout
const fs = require('fs');
const path = require('path');
const map = JSON.parse(fs.readFileSync(path.join(__dirname, 'msg-map.json'), 'utf8'));
let msg = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', d => msg += d);
process.stdin.on('end', () => {
  const lines = msg.split('\n');
  const subject = lines[0].trim();
  if (map[subject]) {
    lines[0] = map[subject];
    process.stdout.write(lines.join('\n'));
  } else {
    process.stdout.write(msg);
  }
});

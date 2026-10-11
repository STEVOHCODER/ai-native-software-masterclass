'use strict';

const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const shellLanguages = new Set(['bash', 'sh', 'shell', 'zsh', 'powershell', 'pwsh', 'cmd', 'console']);
const ignoredDirectories = new Set(['node_modules', '.git']);
const failures = [];

function validate(file) {
  const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/);
  let inFence = false;
  let language = '';
  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    if (line.startsWith('```')) {
      language = line.slice(3).trim().toLowerCase();
      inFence = !inFence;
      continue;
    }
    if (!inFence || !shellLanguages.has(language) || !line.trim() || line.trim().startsWith('#') || line.trim().startsWith('//')) {
      continue;
    }
    if (line.includes('# What/why:')) failures.push(`${path.relative(root, file)}:${index + 1}`);
  }
}

function visit(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (ignoredDirectories.has(entry.name)) continue;
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) visit(target);
    else if (entry.isFile() && entry.name.endsWith('.md')) validate(target);
  }
}

visit(root);
if (failures.length) {
  throw new Error(`Unannotated Markdown command lines:\n${failures.join('\n')}`);
}
process.stdout.write('Markdown command blocks contain no inline What/why explanation markers.\n');

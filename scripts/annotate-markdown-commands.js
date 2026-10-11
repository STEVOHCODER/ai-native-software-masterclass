'use strict';

const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const shellLanguages = new Set(['bash', 'sh', 'shell', 'zsh', 'powershell', 'pwsh', 'cmd', 'console']);
const ignoredDirectories = new Set(['node_modules', '.git']);
const annotationPrefix = '# What/why:';

function blockExplanation(notes) {
  const uniqueNotes = [...new Set(notes.filter(Boolean).map((note) => note.replace(/[.]+$/, '').trim()))];
  if (!uniqueNotes.length) return '';
  const normalized = uniqueNotes.map((note) => note.charAt(0).toLowerCase() + note.slice(1));
  return `These commands ${normalized.join('; they also ')}.`;
}

function annotateFile(file) {
  const original = fs.readFileSync(file, 'utf8');
  const lines = original.split(/\r?\n/);
  const output = [];
  let index = 0;

  while (index < lines.length) {
    const opening = lines[index];
    if (!opening.startsWith('```')) {
      output.push(opening);
      index += 1;
      continue;
    }

    const language = opening.slice(3).trim().toLowerCase();
    const closingIndex = lines.findIndex((line, candidate) => candidate > index && line.startsWith('```'));
    if (closingIndex === -1 || !shellLanguages.has(language)) {
      output.push(opening);
      index += 1;
      continue;
    }

    const contents = lines.slice(index + 1, closingIndex);
    const notes = contents
      .filter((entry) => entry.trim().startsWith(annotationPrefix))
      .map((entry) => entry.replace(annotationPrefix, '').trim());
    const cleaned = contents.filter((entry) => !entry.trim().startsWith(annotationPrefix));
    const explanation = blockExplanation(notes);
    if (explanation) output.push(explanation, '');
    output.push(opening, ...cleaned, lines[closingIndex]);
    index = closingIndex + 1;
  }

  const updated = output.join('\n');
  if (updated !== original) fs.writeFileSync(file, updated, 'utf8');
}

function visit(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (ignoredDirectories.has(entry.name)) continue;
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) visit(target);
    else if (entry.isFile() && entry.name.endsWith('.md')) annotateFile(target);
  }
}

visit(root);
process.stdout.write('Annotated executable shell lines in Markdown files.\n');

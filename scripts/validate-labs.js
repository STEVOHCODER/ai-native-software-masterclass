'use strict';

const fs = require('node:fs');
const path = require('node:path');

const requiredSections = [
  '## Starting point',
  '## Installation',
  '## Configuration',
  '## Execution',
  '## Expected result',
  '## Verification',
  '## Troubleshooting',
  '## Completion criteria',
  '## Command annotations: what and why',
];

const root = path.resolve(__dirname, '..');
const chapters = fs.readdirSync(root, { withFileTypes: true })
  .filter((entry) => entry.isDirectory() && /^chapter-\d{2}-/.test(entry.name))
  .sort((left, right) => left.name.localeCompare(right.name));

if (chapters.length !== 12) {
  throw new Error(`Expected 12 chapters, found ${chapters.length}`);
}

for (const chapter of chapters) {
  const file = path.join(root, chapter.name, 'LAB.md');
  if (!fs.existsSync(file)) throw new Error(`${chapter.name} is missing LAB.md`);
  const content = fs.readFileSync(file, 'utf8');
  const missing = requiredSections.filter((section) => !content.includes(section));
  if (missing.length) throw new Error(`${chapter.name} is missing: ${missing.join(', ')}`);
  const explanationFile = path.join(root, chapter.name, 'EXPLAINED.md');
  if (!fs.existsSync(explanationFile)) throw new Error(`${chapter.name} is missing EXPLAINED.md`);
  const explanation = fs.readFileSync(explanationFile, 'utf8');
  if (!explanation.startsWith('# ')) throw new Error(`${chapter.name}/EXPLAINED.md needs a title heading`);
}

process.stdout.write(`Validated practical lab contract for ${chapters.length} chapters.\n`);

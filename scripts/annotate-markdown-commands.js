'use strict';

const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const shellLanguages = new Set(['bash', 'sh', 'shell', 'zsh', 'powershell', 'pwsh', 'cmd', 'console']);
const ignoredDirectories = new Set(['node_modules', '.git']);
const annotationPrefix = '# What/why:';

function blockExplanation(contents) {
  const commands = contents
    .filter((line) => line.trim() && !line.trim().startsWith('#') && !line.trim().startsWith('//'))
    .map((line) => line.trim());
  if (!commands.length) return '';

  const joined = commands.join(' ');
  if (/\bwinget\b/i.test(joined)) return 'Run these commands in PowerShell to verify that WinGet is available and install the Windows development tools used in the course.';
  if (/\bscoop\b/i.test(joined)) return 'Run these commands in PowerShell to configure Scoop and install developer tools without requiring machine-wide package installation.';
  if (/\bbrew\b/i.test(joined)) return 'Run these commands in the macOS shell to configure Homebrew and install the runtimes and utilities required by the course.';
  if (/\bapt(-get)?\b/i.test(joined)) return 'Run these commands on Ubuntu or Debian to refresh package metadata, install the required tools, and verify their versions.';
  if (/\bdocker\s+run\b/i.test(joined)) return 'Run these commands to start the local container service with a fixed name, credentials, database, and published port so later labs can connect to it.';
  if (/\bdocker\s+(build|compose|pull|ps|logs|inspect)\b/i.test(joined)) return 'Run these Docker commands to build, start, inspect, or diagnose the reproducible local service used by this lab.';
  if (/\b(curl|Invoke-RestMethod|irm)\b/i.test(joined)) return 'Run these commands to make the network request, fail visibly on HTTP errors, and inspect the returned service or deployment response.';
  if (/\b(psql|mongosh|atlas|supabase)\b/i.test(joined)) return 'Run these database CLI commands to apply the schema or migration and verify that the expected persistent state exists.';
  if (/\b(git|gh)\b/i.test(joined)) return 'Run these Git and GitHub CLI commands to create an auditable change, inspect its status, and apply the repository workflow required by this lab.';
  if (/\b(node|npm|pnpm|yarn|corepack|bun)\b/i.test(joined)) return 'Run these commands to install or execute the project tooling, then verify that the local implementation produces the expected result.';
  if (/\b(python|pip)\b/i.test(joined)) return 'Run these commands to create or use the Python environment, install its dependencies, and verify the interpreter configuration.';
  if (/\b(openssl|dig|Resolve-DnsName|Test-NetConnection)\b/i.test(joined)) return 'Run these commands to inspect DNS, TLS, or network connectivity directly and compare the observed result with the intended configuration.';
  if (/\b(export|\$env:|Set-Item)\b/i.test(joined)) return 'Run these commands to load the required configuration into the current process so the following tool can authenticate and use the selected service.';
  return `Run these commands to complete the ${commands[0].split(/\s+/)[0]} step and verify its result before continuing.`;
}

function annotateFile(file) {
  const original = fs.readFileSync(file, 'utf8');
  const lines = original.split(/\r?\n/).filter((line) => (
    !/^These commands /.test(line.trim()) &&
    !/^The commands below are included to /.test(line.trim())
  ));
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
    const cleaned = contents.filter((entry) => !entry.trim().startsWith(annotationPrefix));
    const explanation = blockExplanation(cleaned);
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
process.stdout.write('Added concrete explanations above executable shell blocks in Markdown files.\n');

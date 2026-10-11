'use strict';

const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const shellLanguages = new Set(['bash', 'sh', 'shell', 'zsh', 'powershell', 'pwsh', 'cmd', 'console']);
const ignoredDirectories = new Set(['node_modules', '.git']);
const annotationPrefix = '# What/why:';

function description(command) {
  const value = command.trim();
  if (!value) return 'This continuation line supplies arguments to the command above; keeping it separate makes the complete command readable.';
  if (/^#/.test(value)) return null;
  if (/^winget install/.test(value)) return 'Install the selected Windows package so the required tool is available to later labs.';
  if (/^winget /.test(value)) return 'Inspect or operate the Windows package manager before changing the workstation.';
  if (/^scoop install/.test(value)) return 'Install the developer tool through Scoop without requiring machine-wide installation.';
  if (/^brew install/.test(value)) return 'Install the required developer tool through Homebrew on macOS.';
  if (/^sudo apt-get update/.test(value)) return 'Refresh Linux package metadata so installation uses current package indexes.';
  if (/^sudo apt-get install/.test(value)) return 'Install the runtime or system dependency required by the next lab step.';
  if (/^curl /.test(value)) return 'Fetch the requested HTTPS resource or exercise the HTTP endpoint while failing visibly on errors.';
  if (/^irm /.test(value) || /^Invoke-RestMethod/.test(value)) return 'Use PowerShell to download or call the service with explicit error behavior.';
  if (/^docker pull/.test(value)) return 'Download the pinned container image before creating a reproducible local service.';
  if (/^docker run/.test(value)) return 'Start the local container with explicit name, environment, port, and lifecycle settings.';
  if (/^docker build/.test(value)) return 'Build the deployable container artifact from the repository and its Dockerfile.';
  if (/^docker /.test(value)) return 'Inspect or operate the local container runtime used by the course.';
  if (/^(corepack|npm|pnpm|yarn|bun) install/.test(value)) return 'Install project dependencies using the selected package manager and its lockfile policy.';
  if (/^(corepack|npm|pnpm|yarn|bun) /.test(value)) return 'Run the project tool through the configured package-manager/runtime workflow.';
  if (/^git clone/.test(value)) return 'Copy the cumulative course repository and its history onto this computer.';
  if (/^git switch/.test(value)) return 'Create or select an isolated branch so experimental work does not modify the shared branch.';
  if (/^git config/.test(value)) return 'Set the Git behavior needed for reproducible collaboration and agent review.';
  if (/^git /.test(value)) return 'Inspect or change version-controlled project state in an auditable way.';
  if (/^gh /.test(value)) return 'Use the authenticated GitHub CLI for repository, pull-request, or release operations.';
  if (/^(node|nodejs) /.test(value)) return 'Run a Node.js script or diagnostic using the project runtime.';
  if (/^python/.test(value)) return 'Run Python for an isolated utility, configuration check, or environment verification.';
  if (/^(psql|mongosh|atlas|supabase) /.test(value)) return 'Use the database CLI to apply, inspect, or verify state in the selected environment.';
  if (/^export /.test(value) || /^\$env:/.test(value)) return 'Set a process environment variable so the next command receives explicit configuration.';
  if (/^Set-/.test(value) || /^New-Item/.test(value) || /^Copy-Item/.test(value)) return 'Create, copy, or configure a real local file/path used by the tool.';
  if (/^(mkdir|cd|Set-Location|where|Get-Command|command -v|type -a|Resolve-DnsName|Test-NetConnection)/.test(value)) return 'Inspect or prepare the local machine so the next operation has a known path and state.';
  if (/^(openssl|dig)/.test(value)) return 'Inspect DNS or TLS evidence at the network boundary rather than assuming it is correct.';
  if (/^printf /.test(value)) return 'Send one deterministic protocol request to the process so its response can be verified.';
  if (/^tail |^Get-Content /.test(value)) return 'Read bounded diagnostic output so failures can be investigated without dumping an unbounded log.';
  if (/^Remove-Item/.test(value)) return 'Remove only the named temporary lab artifact after its verification is complete.';
  if (/^test /.test(value) || /^if /.test(value)) return 'Evaluate a local prerequisite or branch condition before continuing the setup.';
  return 'Execute this lab step; the surrounding explanation defines its expected result and reason for inclusion.';
}

function annotateFile(file) {
  const original = fs.readFileSync(file, 'utf8');
  const lines = [];
  let lastCodeLine = '';
  for (const line of original.split(/\r?\n/)) {
    if (line.trim().startsWith(annotationPrefix) && /(?:\\|`)\s*$/.test(lastCodeLine)) continue;
    lines.push(line);
    if (line.trim() && !line.trim().startsWith(annotationPrefix)) lastCodeLine = line;
  }
  const output = [];
  let inFence = false;
  let language = '';
  let previousWasAnnotation = false;
  let previousCommandContinues = false;

  for (const line of lines) {
    if (line.startsWith('```')) {
      language = line.slice(3).trim().toLowerCase();
      inFence = !inFence;
      previousWasAnnotation = false;
      previousCommandContinues = false;
      output.push(line);
      continue;
    }

    if (!inFence || !shellLanguages.has(language) || !line.trim() || line.trim().startsWith('#') || line.trim().startsWith('//')) {
      output.push(line);
      previousWasAnnotation = line.trim().startsWith(annotationPrefix);
      if (line.trim()) previousCommandContinues = false;
      continue;
    }

    if (line.includes(annotationPrefix) || previousWasAnnotation || previousCommandContinues) {
      output.push(line);
      previousWasAnnotation = false;
      previousCommandContinues = /(?:\\|`)\s*$/.test(line);
      continue;
    }

    const note = description(line);
    if (note) output.push(`${annotationPrefix} ${note}`);
    output.push(line);
    previousWasAnnotation = false;
    previousCommandContinues = /(?:\\|`)\s*$/.test(line);
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

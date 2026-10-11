'use strict';

const { execFileSync } = require('node:child_process');

const executable = (command) => process.platform === 'win32' && command === 'npm' ? 'npm.cmd' : command;
const required = [
  ['node', ['--version']],
  ['npm', ['--version']],
  ['git', ['--version']],
];

for (const [command, args] of required) {
  try {
    const version = execFileSync(executable(command), args, { encoding: 'utf8', shell: process.platform === 'win32', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
    process.stdout.write(`${command}: ${version}\n`);
  } catch (error) {
    process.stderr.write(`Missing or unusable command ${command}: ${error.message}\n`);
    process.exitCode = 1;
  }
}

if (process.versions.node.split('.')[0] < 22) {
  process.stderr.write(`Node 22 or newer is required; found ${process.version}\n`);
  process.exitCode = 1;
}

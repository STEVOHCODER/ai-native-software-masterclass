'use strict';

const { spawn } = require('node:child_process');
const { writeFile } = require('node:fs/promises');
const path = require('node:path');

const command = process.env.TEST_COMMAND || 'node';
const args = process.env.TEST_ARGS ? process.env.TEST_ARGS.split(' ') : ['--test', path.join(__dirname, 'concurrency.test.js')];
const child = spawn(command, args, { cwd: path.resolve(__dirname, '..'), shell: process.platform === 'win32' });
let output = '';
child.stdout.on('data', (chunk) => { output += chunk; process.stdout.write(chunk); });
child.stderr.on('data', (chunk) => { output += chunk; process.stderr.write(chunk); });
child.on('close', async (code) => {
  await writeFile(path.join(__dirname, 'last-diagnostics.log'), output.slice(-100_000), 'utf8');
  process.exit(code === 0 ? 0 : 1);
});


#!/usr/bin/env node
'use strict';

const path = require('node:path');
const { execFileSync } = require('node:child_process');

const repository = path.resolve(__dirname, '..');
const ignored = new Set(['.git', 'node_modules', '.next', 'dist', 'coverage']);
const sensitive = /\.(env|pem|key|p12|pfx)$/i;
const intervalMs = Number(process.env.AGENT_CHECKPOINT_INTERVAL_MS || 30000);

function runGit(args) {
  return execFileSync('git', ['-C', repository, ...args], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
}

function changedFiles() {
  return runGit(['status', '--porcelain=v1']).split(/\r?\n/).filter(Boolean).map((line) => line.slice(3).trim()).filter((file) => !file.split(/[\\/]/).some((part) => ignored.has(part)) && !sensitive.test(file));
}

function checkpoint() {
  const files = changedFiles();
  if (!files.length) return;
  runGit(['add', '--', ...files]);
  const message = `chore: agent checkpoint ${new Date().toISOString()}`;
  try {
    runGit(['commit', '-m', message]);
    process.stdout.write(`${message} (${files.length} files)\n`);
  } catch (error) {
    process.stderr.write(`Checkpoint skipped: ${error.message}\n`);
  }
}

if (process.argv.includes('--once')) checkpoint();
else {
  process.stdout.write(`Watching ${repository} every ${intervalMs}ms\n`);
  setInterval(checkpoint, intervalMs);
}

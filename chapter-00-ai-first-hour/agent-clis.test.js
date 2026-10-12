'use strict';

const test = require('node:test'); // Use Node's built-in test runner so the course needs no test framework install.
const assert = require('node:assert/strict'); // Use strict equality assertions.
const { parseVersion, classifyAgents, AGENTS } = require('./agent-clis'); // Test the real module, not a copy.

test('parseVersion extracts a version from noisy agent CLI output', () => { // Real CLIs print banners and build metadata around the version.
  assert.equal(parseVersion('claude 1.2.3 (Claude Code)'), '1.2.3');
  assert.equal(parseVersion('opencode version 0.9.1\nnode v24.20.0'), '0.9.1');
});

test('parseVersion returns null when no version appears in the output', () => { // A missing version is a real outcome and must be distinguishable from a version of "0".
  assert.equal(parseVersion('command not found'), null);
  assert.equal(parseVersion(''), null);
});

test('classifyAgents separates installed agents from missing ones', () => { // The lab report is the learner's evidence that their workstation is ready.
  const report = classifyAgents([
    { name: 'claude', version: '1.2.3', exitCode: 0 },
    { name: 'opencode', version: null, exitCode: 1 },
  ]);
  assert.equal(report.ready.length, 1);
  assert.equal(report.ready[0].name, 'claude');
  assert.equal(report.ready[0].version, '1.2.3');
  // codex was never probed, so the report still lists it alongside the failed opencode probe.
  assert.deepEqual(report.missing.map((agent) => agent.name), ['opencode', 'codex']);
});

test('classifyAgents treats an agent without a version as missing even when the exit code is zero', () => { // A shim that runs but prints no version is not a usable installation.
  const report = classifyAgents([
    { name: 'codex', version: null, exitCode: 0 },
  ]);
  assert.equal(report.ready.length, 0);
  assert.equal(report.missing.length, 3);
  assert.ok(report.missing.some((agent) => agent.name === 'codex'));
});

test('classifyAgents always reports every known agent exactly once', () => { // A missing probe result must still appear in the report so the learner sees the full checklist.
  const report = classifyAgents([]);
  assert.equal(report.ready.length, 0);
  assert.equal(report.missing.length, AGENTS.length);
  assert.deepEqual(report.missing.map((agent) => agent.name), AGENTS.map((agent) => agent.name));
});
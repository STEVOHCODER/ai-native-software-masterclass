'use strict';

// This module proves which AI coding agents are installed on the learner's machine.
// Detection is separated from classification so the decision logic can be tested without spawning processes.

const { spawnSync } = require('node:child_process'); // Detection runs real commands; classification stays pure.

// The three agents taught in this course, in installation order.
const AGENTS = [
  { name: 'claude', command: 'claude', install: 'npm install -g @anthropic-ai/claude-code' },
  { name: 'opencode', command: 'opencode', install: 'npm install -g opencode-ai' },
  { name: 'codex', command: 'codex', install: 'npm install -g @openai/codex' },
];

// Matches the first semantic version, ignoring surrounding banner text and node versions.
const VERSION_PATTERN = /(\d+\.\d+\.\d+)/;

/**
 * Extracts a version from noisy CLI output, returning null when none is present.
 * null is meaningfully different from '0': it means the tool is not usable.
 */
function parseVersion(output) {
  if (typeof output !== 'string') return null;
  const match = output.match(VERSION_PATTERN);
  return match ? match[1] : null;
}

/**
 * Turns probe results into the learner's ready/missing checklist.
 * Agents that produced no probe result are still reported, so the checklist is never partial.
 */
function classifyAgents(probes = []) {
  const byName = new Map(probes.map((probe) => [probe.name, probe]));
  const ready = [];
  const missing = [];
  for (const agent of AGENTS) {
    const probe = byName.get(agent.name);
    // A zero exit code is not enough: a shim that prints no version is not a usable install.
    if (probe && probe.version && (probe.exitCode === undefined || probe.exitCode === 0)) {
      ready.push({ ...agent, version: probe.version });
    } else {
      missing.push(agent);
    }
  }
  return { ready, missing };
}

/**
 * Runs each agent's version flag on the host and returns raw probe results.
 * This is the only impure function; the lab calls it and the tests do not.
 */
function detectAgents() {
  const isWindows = process.platform === 'win32';
  return AGENTS.map((agent) => {
    // Windows resolves npm shims (.cmd) only through cmd.exe; passing shell:true instead would
    // trigger Node's argument-escaping deprecation warning, so the shell is invoked explicitly.
    const result = isWindows
      ? spawnSync(process.env.ComSpec || 'cmd.exe', ['/d', '/s', '/c', `${agent.command} --version`], { encoding: 'utf8', timeout: 10000 })
      : spawnSync(agent.command, ['--version'], { encoding: 'utf8', timeout: 10000 });
    const output = `${result.stdout || ''}\n${result.stderr || ''}`;
    return {
      name: agent.name,
      version: result.error ? null : parseVersion(output),
      exitCode: result.error ? 1 : result.status,
    };
  });
}

/**
 * Convenience helper used by the lab's verification step.
 */
function auditAgents() {
  const report = classifyAgents(detectAgents());
  return { ...report, allReady: report.missing.length === 0 };
}

module.exports = { AGENTS, parseVersion, classifyAgents, detectAgents, auditAgents };
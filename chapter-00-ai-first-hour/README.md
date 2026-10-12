# Chapter 00 - Your First Hour With AI Coding Agents

This chapter has one job: prove that the learner's machine can talk to a real AI model and can run real AI coding agents. Everything later in the course assumes this worked.

## Why this chapter exists

The original course began at chapter 01 with workstation setup, then waited until chapter 02 before touching an AI provider. A learner could finish four chapters without ever seeing a model answer. This chapter closes that gap by putting the first working AI call and the first agent audit in the first hour.

## What is in this folder

| File | Purpose |
|---|---|
| `ai-request.js` | Dependency-free provider resolution, request building, and response parsing. |
| `agent-clis.js` | Detection and classification of the `claude`, `opencode`, and `codex` command-line agents. |
| `ai-request.test.js` | Proves the request shape and response parsing without spending money. |
| `agent-clis.test.js` | Proves version parsing and the ready/missing checklist. |
| `AGENT-INSTALL-MATRIX.md` | Exact install command, auth step, and verification flag per agent. |
| `EXPLAINED.md` | Line-by-line reasoning for every function. |
| `LAB.md` | The practical lab contract with evidence requirements. |

## The design rule

`buildRequest` and `parseCompletion` are pure functions. They never touch the network, so they can be tested for free and forever. Only `requestCompletion` performs I/O, and only the lab calls it. This split is the lesson: keep the logic you care about testable, and isolate the part that costs money.

## Cost discipline

`buildRequest` requires a non-empty prompt and defaults `maxTokens` to a small bound. A blank prompt or an unbounded token budget is how beginners accidentally spend a month's credit in one command.

## Running it

```bash
node --test chapter-00-ai-first-hour/*.test.js
node -e "console.log(require('./chapter-00-ai-first-hour/agent-clis').auditAgents())"
```

The audit runs `claude --version`, `opencode --version`, and `codex --version` on the host and prints which agents are usable. A missing key or missing agent is reported, never thrown, so the chapter always produces output.

## What the learner should be able to do afterwards

- Explain the difference between a base URL, an auth header, and a model name.
- Say why a pure request builder is preferable to an SDK call inside a test.
- Install and authenticate three different AI coding agents and prove each one runs.
- Identify which environment variable supplies the model key, and never commit it.
# Practical Lab 00 - Make an AI Model Answer and Audit Your Coding Agents

In this lab you install at least one AI coding agent, audit all three, and make a real language model return text using nothing but Node's built-in `fetch`. You finish with machine-readable evidence rather than a feeling that it worked.

## Starting point

Use your own Windows, macOS, or Ubuntu/Debian computer with Node.js 20 or newer already available. Chapter 01 installs Node if you have not completed it, but this lab deliberately has a lower prerequisite bar so a learner without a fully prepared workstation can still reach a working AI call.

You do not need an API key to complete the installation or verification steps. You need one only for the optional live call in the Execution section.

## Installation

Install at least one coding agent. All three commands install globally so the executable resolves on `PATH`.


Run these commands to install the Claude Code command-line agent globally and confirm the package manager can write to its prefix.


```bash
npm install -g @anthropic-ai/claude-code
```


Run these commands to install the OpenCode command-line agent globally.


```bash
npm install -g opencode-ai
```


Run these commands to install the Codex command-line agent globally.


```bash
npm install -g @openai/codex
```

`-g` is required because the chapter probes these commands by name from a child process. Without a global install, `--version` cannot resolve and the audit will report the agent as missing.

If the install fails with a permissions error, run `npm config get prefix`. A prefix under `Program Files` means the global directory needs elevation; install Node through a version manager instead of running npm as administrator. The reasoning is in `AGENT-INSTALL-MATRIX.md`.

## Configuration

Authenticate the agent you installed. Authentication methods differ per agent, so follow the row for the one you installed.


Run these commands to authenticate the Claude Code agent and confirm it reports a version.


```bash
claude login
claude --version
```


Run these commands to check the Codex and OpenCode version flags used by the audit.


```bash
codex --version
```


Set a provider key for the live call. Export it for the current shell only; do not write it into a committed file.


Run these commands to supply a provider key for the current shell session on macOS or Linux.


```bash
export ANTHROPIC_API_KEY="your-key-here"
```


Run these commands to supply a provider key for the current shell session in PowerShell.


```powershell
$env:ANTHROPIC_API_KEY = "your-key-here"
```

A shell-exported variable disappears when the window closes. That is the intended behaviour: a key in your shell history or in a committed `.env` file is the most common way beginners leak a credential.

If your repository has a `.env` file from chapter 01, add the key there only for local work and confirm `.gitignore` lists it before running any `git add`.

## Execution

First, audit which agents this machine can actually run. The audit reports missing agents instead of failing, so it always produces output.


Run these commands to audit every agent this chapter teaches and print a ready or missing verdict.


```bash
node -e "const {auditAgents}=require('./chapter-00-ai-first-hour/agent-clis'); console.log(auditAgents());"
```

Now run the unit tests. They never call a network and never spend money.


Run these commands to execute the free offline tests for this chapter.


```bash
node --test chapter-00-ai-first-hour/*.test.js
```

Then make a real model answer. Skip this step if you have no key; the chapter is still complete once the audit and tests pass.


Run these commands to send one real request with a bounded token budget and print the model's reply.


```bash
node -e "const {resolveProvider,requestCompletion}=require('./chapter-00-ai-first-hour/ai-request'); const p=resolveProvider(); if(!p){console.log('No key set - see Configuration'); process.exit(0);} requestCompletion({provider:p,prompt:'Reply with exactly: AI ONLINE',maxTokens:16}).then(t=>console.log('model:',p.model,'->',t));"
```

## Expected result

The audit prints one of two outcomes.

A prepared machine prints every probed agent with a version and an `allReady` value of `true`:

```
ready: claude@2.1.296, codex@0.162.1
missing: none
```

A machine with one agent prints the rest with their install commands and `allReady` set to `false`. This is a valid result, not a failure.

The test run reports fifteen passing tests and zero failures.

The live call prints the resolved model name and its reply, for example `model: claude-sonnet-4-5 -> AI ONLINE`. Without a key it prints `No key set - see Configuration` and exits successfully.

## Verification

A claim is not evidence. Each command below proves one thing.


Run these commands to count passing tests and fail the lab if the count is not exactly fifteen.


```bash
node --test --test-reporter=tap chapter-00-ai-first-hour/*.test.js | grep -c "^ok"
```


Run these commands to confirm the pure request builder targets the correct provider endpoint without sending any request.


```bash
node -e "const {resolveProvider,buildRequest}=require('./chapter-00-ai-first-hour/ai-request'); const r=buildRequest({provider:resolveProvider({OPENAI_API_KEY:'test'}),prompt:'ping',maxTokens:8}); console.log(r.url); console.log(r.init.headers.authorization);"
```


Run these commands to prove the chapter does not modify tracked course files.


```bash
git diff --exit-code
```


Run these commands to run the repository's own lab structure check.


```bash
node scripts/validate-labs.js
```

The authorization line printed by the second command contains a fake key. That is intentional: it proves the header format without transmitting anything.

## Troubleshooting

**The audit reports every agent as missing.** The global install did not land on `PATH`. Confirm with `npm list -g --depth=0`, then open a new terminal so the shell reloads its command search path.

**An agent runs but is reported missing.** Its `--version` output contained no `major.minor.patch` pattern. Run the command manually and read what it prints. A wrapper script that prints a greeting instead of a version is the usual cause.

**`No AI provider configured` appears during the live call.** The key is missing or blank in this specific terminal. Re-export it here; a key set in another window or in a `.env` file that was never loaded is not visible to this process.

**The live call returns a 401.** The key is wrong, expired, or has not finished provisioning. A newly created key can take a short time to become active; retry once before assuming the key is invalid.

**The live call returns a 404 on `api.anthropic.com`.** The provider key was set but the base URL is being read from an override. Confirm `resolveProvider()` reports the provider you expect before changing anything else.

**`npm install -g` fails with `EPERM` or a prefix error.** Do not retry as administrator. Install Node through a version manager so the global prefix is inside your user profile, then reinstall the agent.

## Completion criteria

You have completed this lab when you can do all of the following without reading the instructions.

- Point at the file that decides which provider is used and explain why it is a list rather than an `if` statement.
- Explain why `maxTokens` is bounded in `buildRequest` and what happens without it.
- Explain why `parseCompletion` handles two response shapes instead of one.
- State which command proves your installed agents, and why that command is run inside a `node -e` call.
- Explain why the unit tests do not call the model API.
- Run the audit and correctly interpret an `allReady` value of `false`.
- Confirm that no credential appears in a tracked file.

If any item is uncertain, rerun the verification block and read `EXPLAINED.md` for the reasoning behind the function you are unsure about.

## Command annotations: what and why

The comments below are intentionally next to the commands learners execute.


Run these commands to install the Claude Code agent globally so its version probe can resolve on PATH.


```bash
npm install -g @anthropic-ai/claude-code      # Install the agent into the global prefix so the CLI is on PATH.
```

`-g` matters because `agent-clis.js` spawns `claude` by name. A local install would be invisible to that probe and the agent would be reported missing.


Run these commands to install the OpenCode agent globally.


```bash
npm install -g opencode-ai                   # Install OpenCode into the global prefix for the same reason.
```

Both agents ship as npm packages, so the same package manager and the same prefix govern both installs.


Run these commands to install the Codex agent globally.


```bash
npm install -g @openai/codex                 # Install the Codex CLI globally for the audit probe.
```

The audit probes all three agents with the same `--version` flag, so each one must be reachable the same way.


Run these commands to authenticate the agent and print the version used by the audit.


```bash
claude login                                 # Complete the interactive login so the agent can reach a model.
claude --version                             # Print the version string the audit parses.
```

Login and version are separate concerns. Authentication proves entitlement; the version flag proves the executable resolves.


Run these commands to supply a provider key for the current PowerShell session only.


```powershell
$env:ANTHROPIC_API_KEY = "your-key-here"      # Set the key for this shell only so it never reaches a committed file.
```

A session-scoped variable is the safest default. A key written into a tracked `.env` file is a leaked credential.


Run these commands to audit the agents on this machine.


```bash
node -e "const {auditAgents}=require('./chapter-00-ai-first-hour/agent-clis'); console.log(auditAgents());"
```

The audit spawns each version flag and classifies the result, returning a report instead of throwing so a partially prepared machine still produces output.


Run these commands to run the offline unit tests for this chapter.


```bash
node --test chapter-00-ai-first-hour/*.test.js   # Execute the free tests that never contact a provider.
```

These tests are free and hermetic by design; the only network call in the chapter lives in the lab's optional step.


Run these commands to send one bounded request to a real model and print its reply.


```bash
node -e "const {resolveProvider,requestCompletion}=require('./chapter-00-ai-first-hour/ai-request'); const p=resolveProvider(); if(!p){console.log('No key set - see Configuration'); process.exit(0);} requestCompletion({provider:p,prompt:'Reply with exactly: AI ONLINE',maxTokens:16}).then(t=>console.log('model:',p.model,'->',t));"
```

The early exit keeps the lab usable without a paid key, and `maxTokens:16` keeps a practice call from becoming a billing event.


Run these commands to count the passing tests.


```bash
node --test --test-reporter=tap chapter-00-ai-first-hour/*.test.js | grep -c "^ok"
```

A count is weaker evidence than the reporter's own summary, but it is quick and it makes a regression visible at a glance.


Run these commands to inspect the request the builder would send without sending it.


```bash
node -e "const {resolveProvider,buildRequest}=require('./chapter-00-ai-first-hour/ai-request'); const r=buildRequest({provider:resolveProvider({OPENAI_API_KEY:'test'}),prompt:'ping',maxTokens:8}); console.log(r.url); console.log(r.init.headers.authorization);"
```

Passing a fake key proves the header format while guaranteeing that no real request is made.


Run these commands to confirm the lab did not modify tracked files.


```bash
git diff --exit-code                          # Fail if the lab changed any tracked file unexpectedly.
```

A learning lab should leave the repository exactly as it found it.


Run these commands to validate the lab structure across every chapter.


```bash
node scripts/validate-labs.js                 # Confirm every chapter still satisfies the lab contract.
```

Structural validation is what keeps a growing course consistent as new chapters are added.
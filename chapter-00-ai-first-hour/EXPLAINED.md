# Chapter 00 Code and Command Walkthrough

Every function in this chapter exists because a beginner will otherwise hit it without warning. This file explains the reasoning, not just the syntax.

## `ai-request.js`

### `PROVIDERS`

A list, not a switch statement. Adding a third provider means adding one entry, not editing branching logic. Order matters: the array is walked top to bottom, so the precedence of keys on a machine with two keys is explicit and inspectable rather than accidental.

### `resolveProvider(env)`

Returns a provider descriptor or `null`. It does not throw. A learner who reaches this chapter without a key should still be able to read the setup instructions, so "no provider" is a normal reported state rather than a crash.

The value is trimmed and then checked for emptiness. An exported-but-blank variable is one of the most common shell mistakes, and treating `""` as a valid key produces a confusing 401 from the provider instead of a clear local message.

### `buildRequest({ provider, prompt, maxTokens })`

Pure. No network, no environment access. Three things happen here that beginners usually learn the hard way:

1. **The base URL selects the provider.** `https://api.anthropic.com/v1/messages` and `https://api.openai.com/v1/chat/completions` are different endpoints with the same basic shape. The URL is the contract with the vendor.
2. **The auth header proves identity.** The key travels in a header, never in the URL, because URLs are logged by proxies and browser history.
3. **The token budget bounds cost.** `maxTokens` defaults low and is required to be present. An unbounded request is how a beginner spends a month's credit in a single command.

Validation happens before the request object is built, so an empty prompt or a missing provider fails locally with a readable message instead of costing a network call.

### `parseCompletion(payload)`

The two providers return different shapes. The OpenAI response nests text under `choices[0].message.content`; the Anthropic response returns a `content` array of typed blocks. A helper that understands both keeps that difference in one place.

It returns `''` for an unrecognised shape on purpose. Providers add fields regularly; an unexpected payload must degrade into an empty answer the learner can print, not an exception that stops the lab mid-run.

### `requestCompletion`

The only function that performs I/O. It takes `fetchImpl` so a learner can substitute a recording function while experimenting, but it defaults to the built-in `fetch`. It is called by the lab's verification step and deliberately not by the unit tests, because a real call requires a key, a network, and a small spend.

## `agent-clis.js`

### `AGENTS`

Name, probe command, and install command for each agent. Keeping the install command next to the name means the audit report can tell the learner exactly what to type next, which turns a report into a plan.

### `parseVersion(output)`

Real CLIs print banners, node versions, and build metadata around the version string. The first `major.minor.patch` match is extracted.

It returns `null`, never `0`, when nothing matches. That distinction is deliberate: `null` means "this tool is not usable", while `0` would read as "installed, version zero" and hide a broken install.

### `classifyAgents(probes)`

Turns raw probe results into the learner's checklist. Two rules matter:

- **A version is required, not just a zero exit code.** A shim that runs and exits cleanly while printing no version is not a working installation. Trusting the exit code alone produces false confidence.
- **Every known agent is reported.** Agents that were never probed appear in `missing`, so the checklist is never partial and the learner always sees the full set of what remains.

### `detectAgents()`

The only impure function. It runs each agent's `--version` flag and returns raw results for classification.

On Windows, npm-installed agents are `.cmd` shims that Node cannot execute directly. The shell is therefore invoked explicitly as `cmd.exe /d /s /c` rather than by passing `shell: true`, which avoids Node's argument-escaping deprecation warning and keeps the learner's terminal output clean enough to read.

## Why the tests look the way they do

`ai-request.test.js` never calls the network. It asserts the exact URL, header, and body shape produced by `buildRequest`, and both response formats understood by `parseCompletion`. Fifteen assertions, zero cost, runs on every machine.

`agent-clis.test.js` tests `classifyAgents` with hand-written probe results instead of spawning real processes. Spawning a real CLI in a unit test makes the test slow, machine-dependent, and dependent on the learner's install state. The impure boundary is exercised once, in the lab, where its output is the evidence the learner needs.
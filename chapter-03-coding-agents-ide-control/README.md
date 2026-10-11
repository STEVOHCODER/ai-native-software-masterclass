# Chapter 03 — Coding Agents and IDE Control

## Outcome

Learners will operate terminal agents and IDE assistants as controlled engineering collaborators: write an executable task brief, constrain permissions, provide repository instructions, inspect diffs, and require tests before merging.

## 1. Install the tool families

Install each tool only if it fits the learner's workflow. Do not install every agent on a production workstation.

```powershell
# Windows package-manager examples
winget install --id GitHub.Copilot
winget install --id Anthropic.Claude
```

```bash
# macOS/Linux package-manager examples
brew install node
npm install --global @openai/codex
npm install --global opencode-ai
```

Claude Code, Codex CLI, OpenCode, and OpenClaw have different release channels and command names; use each vendor's official installer and verify with `<command> --version`. The course rule is the same: start in a disposable branch and deny destructive commands by default.

For IDE assistants, install Cline, Roo Code, Continue.dev, GitHub Copilot, or Kilo from the editor marketplace. Restart the editor after installation and confirm the extension is scoped to the intended workspace.

## 2. Repository instruction contract

Every agent task must state:

```text
Goal: one measurable behavior.
Allowed files: explicit paths.
Forbidden actions: no secrets, no history rewrite, no production deploy.
Validation: exact commands and expected result.
Definition of done: tests, docs, and clean diff.
```

Example:

```text
Implement PATCH /api/progress/:id optimistic locking.
Read `chapter-08-backend-pipelines-concurrency/server.js` and `chapter-09-automated-verification-testing/concurrency.test.js` first.
Do not change package versions or delete tests.
Run `pnpm run test:concurrency` and `node --check chapter-08-backend-pipelines-concurrency/server.js`.
Return changed files, risks, and command output.
```

## 3. Permission tiers

| Tier | Read files | Edit files | Execute commands | Network |
|---|---|---|---|---|
| Observe | yes | no | approved read-only | no |
| Implement | yes | branch only | allow-listed | restricted |
| Release | yes | release branch | CI only | CI credentials |

Use local embeddings for source indexing when privacy matters. Use cloud models for reasoning only after confirming retention, training, region, and contractual terms.

## 4. Continue.dev configuration

`continue-config.json` demonstrates a local embedding provider and routed cloud model. Replace example environment references using the extension secret store, not plaintext JSON. Set context retrieval limits to prevent entire repositories and credentials from entering prompts.

## 5. Agent review lab

```bash
git switch -c lab/agent-controlled-change
git diff --check
pnpm run test:concurrency
git status --short
```

Reject any agent output that lacks a test result, introduces an unreviewed dependency, or changes files outside the task boundary.

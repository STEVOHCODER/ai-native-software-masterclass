# Chapter 03 — Coding Agents and IDE Control

## Outcome

Learners will operate terminal agents and IDE assistants as controlled engineering collaborators: write an executable task brief, constrain permissions, provide repository instructions, inspect diffs, and require tests before merging.

## 1. Install the tool families

Install each tool only if it fits the learner's workflow. Do not install every agent on a production workstation.

These commands install the selected Windows package so the required tool is available to later labs.

```powershell
# Windows package-manager examples
winget install --id GitHub.Copilot
winget install --id Anthropic.Claude
```

These commands install the required developer tool through homebrew on macos. They also install project dependencies using the selected package manager and its lockfile policy.

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

These commands create or select an isolated branch so experimental work does not modify the shared branch. They also inspect or change version-controlled project state in an auditable way. They also run the project tool through the configured package-manager/runtime workflow.

```bash
git switch -c lab/agent-controlled-change
git diff --check
pnpm run test:concurrency
git status --short
```

Reject any agent output that lacks a test result, introduces an unreviewed dependency, or changes files outside the task boundary.

## Learn by executing

Run [`LAB.md`](LAB.md) to install and direct an agent on a bounded task. Commands are annotated beside the command they explain; [`EXPLAINED.md`](EXPLAINED.md) explains the configuration and delegation flow.

## 6. Installation matrix

| Agent | Windows | macOS/Linux | Editor/Desktop |
|---|---|---|---|
| Claude Code | `irm https://claude.ai/install.ps1 \| iex` | `curl -fsSL https://claude.ai/install.sh \| bash` | Claude Desktop where available |
| Codex CLI | `npm install --global @openai/codex` | same | VS Code terminal |
| OpenCode | `npm install --global opencode-ai` | same | terminal/editor task runner |
| OpenClaw | official installer/release | official installer/release | agent host |
| GitHub Copilot | `winget install GitHub.Copilot` or VS Code extension | VS Code/JetBrains extension | GitHub Copilot Chat/CLI |
| Cline | VS Code Marketplace | VS Code Marketplace | VS Code |
| Roo Code | VS Code Marketplace | VS Code Marketplace | VS Code |
| Continue | VS Code/JetBrains Marketplace | VS Code/JetBrains Marketplace | `~/.continue/config.json` |
| Kilo | official extension/package | official extension/package | editor extension |

Installer names and package IDs change. Confirm each official source before execution, then verify:

These commands inspect or prepare the local machine so the next operation has a known path and state. They also execute this lab step; the surrounding explanation defines its expected result and reason for inclusion.

```powershell
Get-Command claude, codex, opencode, gh -ErrorAction SilentlyContinue
claude --version; codex --version; opencode --version; gh --version
```

These commands inspect or prepare the local machine so the next operation has a known path and state. They also execute this lab step; the surrounding explanation defines its expected result and reason for inclusion.

```bash
command -v claude codex opencode gh
claude --version; codex --version; opencode --version; gh --version
```

## 7. Per-machine configuration

| Agent | Windows config | macOS/Linux config |
|---|---|---|
| Claude Code | `%USERPROFILE%\\.claude\\settings.json` | `~/.claude/settings.json` |
| Codex CLI | `%USERPROFILE%\\.codex\\config.toml` | `~/.codex/config.toml` |
| OpenCode | `%USERPROFILE%\\.config\\opencode\\opencode.json` | `~/.config/opencode/opencode.json` |
| Continue | `%USERPROFILE%\\.continue\\config.json` | `~/.continue/config.json` |
| VS Code | `%APPDATA%\\Code\\User\\settings.json` | `~/Library/Application Support/Code/User/settings.json` or `~/.config/Code/User/settings.json` |

Windows setup:

These commands create, copy, or configure a real local file/path used by the tool. They also execute this lab step; the surrounding explanation defines its expected result and reason for inclusion.

```powershell
New-Item -ItemType Directory -Force "$HOME\.claude", "$HOME\.codex", "$HOME\.config\opencode", "$HOME\.continue" | Out-Null
Copy-Item .\chapter-03-coding-agents-ide-control\continue-config.json "$HOME\.continue\config.json"
code --install-extension continue.continue
code --install-extension saoudrizwan.claude-dev
code --install-extension RooVeterinaryInc.roo-cline
```

macOS/Linux setup:

These commands inspect or prepare the local machine so the next operation has a known path and state. They also execute this lab step; the surrounding explanation defines its expected result and reason for inclusion.

```bash
mkdir -p ~/.claude ~/.codex ~/.config/opencode ~/.continue
cp chapter-03-coding-agents-ide-control/continue-config.json ~/.continue/config.json
code --install-extension continue.continue
code --install-extension saoudrizwan.claude-dev
code --install-extension RooVeterinaryInc.roo-cline
```

Edit files manually in VS Code, or write deterministic JSON/TOML with PowerShell/Python. Prefer manual review after generation:

These commands read bounded diagnostic output so failures can be investigated without dumping an unbounded log.

```powershell
Get-Content "$HOME\.continue\config.json" | ConvertFrom-Json | ConvertTo-Json -Depth 20
```

These commands run Python for an isolated utility, configuration check, or environment verification.

```bash
python3 -m json.tool ~/.continue/config.json >/dev/null
```

## 8. Agent rules file

Create `AGENTS.md` or the vendor-equivalent in the repository root. It should state the stack, commands, allowed directories, secret policy, migration policy, test expectations, and commit rules. Keep global settings generic; keep repository instructions versioned with the code.

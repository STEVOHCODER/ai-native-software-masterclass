# Practical Lab 03 — Install, Configure, and Direct an AI Coding Agent

## Starting point

Complete Labs 01–02. Create a disposable branch:

These commands create or select an isolated branch so experimental work does not modify the shared branch.

```bash
git switch -c lab/agent-controlled-change
```

Choose one terminal agent and one editor extension. The commands below show common supported forms; always confirm the vendor's current installer before production use.

## Installation

### Terminal agents

Windows PowerShell:

These commands install project dependencies using the selected package manager and its lockfile policy. They also install the selected windows package so the required tool is available to later labs.

```powershell
npm install --global @openai/codex
npm install --global opencode-ai
winget install --id GitHub.cli
```

macOS/Linux:

These commands install project dependencies using the selected package manager and its lockfile policy. They also install the required developer tool through homebrew on macos.

```bash
npm install --global @openai/codex
npm install --global opencode-ai
brew install gh
```

For Claude Code, use the official installer from the Claude developer site; for OpenClaw, use its official release instructions. Do not pipe an unverified third-party script into a shell.

### VS Code extensions

These commands execute this lab step; the surrounding explanation defines its expected result and reason for inclusion.

```powershell
code --install-extension continue.continue
code --install-extension saoudrizwan.claude-dev
code --install-extension RooVeterinaryInc.roo-cline
code --install-extension GitHub.copilot
```

These commands execute this lab step; the surrounding explanation defines its expected result and reason for inclusion.

```bash
code --install-extension continue.continue
code --install-extension saoudrizwan.claude-dev
code --install-extension RooVeterinaryInc.roo-cline
code --install-extension GitHub.copilot
```

## Configuration

Create user directories:

These commands create, copy, or configure a real local file/path used by the tool.

```powershell
New-Item -ItemType Directory -Force "$HOME\.continue", "$HOME\.codex", "$HOME\.config\opencode" | Out-Null
Copy-Item .\chapter-03-coding-agents-ide-control\continue-config.json "$HOME\.continue\config.json"
```

These commands inspect or prepare the local machine so the next operation has a known path and state. They also execute this lab step; the surrounding explanation defines its expected result and reason for inclusion.

```bash
mkdir -p ~/.continue ~/.codex ~/.config/opencode
cp chapter-03-coding-agents-ide-control/continue-config.json ~/.continue/config.json
```

Open the copied file manually in VS Code and select either the local Ollama model or cloud model. For a local model:

These commands execute this lab step; the surrounding explanation defines its expected result and reason for inclusion.

```bash
ollama pull qwen2.5-coder:7b
ollama pull nomic-embed-text
```

Verify the JSON:

These commands read bounded diagnostic output so failures can be investigated without dumping an unbounded log.

```powershell
Get-Content "$HOME\.continue\config.json" -Raw | ConvertFrom-Json | Out-Null
```

These commands run Python for an isolated utility, configuration check, or environment verification.

```bash
python3 -m json.tool ~/.continue/config.json >/dev/null
```

## Execution: give the agent real work

Paste this task into the installed agent:

```text
Inspect the repository before editing. Add a GET /api/progress/:id test for a missing record.
Allowed files: chapter-09-automated-verification-testing/concurrency.test.js only.
Do not install packages, change server behavior, or alter existing assertions.
Run node --test chapter-09-automated-verification-testing/concurrency.test.js.
Return the diff and the exact command output.
```

Then inspect:

These commands inspect or change version-controlled project state in an auditable way. They also run the project tool through the configured package-manager/runtime workflow.

```bash
git diff -- chapter-09-automated-verification-testing/concurrency.test.js
pnpm run test:concurrency
git diff --check
```

## Expected result

The agent adds one focused test, runs it successfully, and changes no other file. You can reject the change and restore the branch if it violates the task boundary.

## Verification

These commands inspect or change version-controlled project state in an auditable way.

```bash
git status --short
git diff --stat
git log --oneline -1
```

## Troubleshooting

| Symptom | Fix |
|---|---|
| Agent cannot find model | Recheck provider key/model setting and reload the extension |
| Extension reads stale config | Fully restart the IDE, not only the terminal |
| Agent edits unrelated files | Revert the branch and tighten `Allowed files` |
| Agent tries to deploy | Stop it; add forbidden actions and disable automatic approvals |
| local Ollama unavailable | Start Ollama and verify `ollama list`; use cloud model only with approval |

## Completion criteria

The agent launches, reads the repository, completes the bounded test task, and the learner can explain the changed lines and prove the test passes.

## Command annotations: what and why

These commands install project dependencies using the selected package manager and its lockfile policy. They also install the selected windows package so the required tool is available to later labs. They also execute this lab step; the surrounding explanation defines its expected result and reason for inclusion.

```powershell
npm install --global @openai/codex                         # Install the Codex terminal agent in the global npm prefix.
npm install --global opencode-ai                           # Install the OpenCode terminal agent for repository tasks.
winget install --id GitHub.cli                             # Install GitHub CLI for authenticated repository operations.
code --install-extension continue.continue                 # Install Continue into VS Code.
code --install-extension saoudrizwan.claude-dev             # Install the Cline extension for agent-assisted edits.
code --install-extension RooVeterinaryInc.roo-cline         # Install Roo Code for an alternate agent workflow.
code --install-extension GitHub.copilot                     # Install GitHub Copilot's editor integration.
```

These commands install project dependencies using the selected package manager and its lockfile policy. They also install the required developer tool through homebrew on macos. They also execute this lab step; the surrounding explanation defines its expected result and reason for inclusion.

```bash
npm install --global @openai/codex                         # Install the Codex command on macOS/Linux.
npm install --global opencode-ai                           # Install OpenCode through the same Node toolchain.
brew install gh                                             # Install GitHub CLI through Homebrew.
code --install-extension continue.continue                 # Install Continue from the VS Code command line.
```

Global npm installation makes the CLI discoverable outside one project; editor installation makes the agent available inside the IDE. Neither command gives the tool permission to deploy or read secrets.

These commands create, copy, or configure a real local file/path used by the tool. They also read bounded diagnostic output so failures can be investigated without dumping an unbounded log.

```powershell
New-Item -ItemType Directory -Force "$HOME\.continue", "$HOME\.codex", "$HOME\.config\opencode" | Out-Null # Create real per-user config folders.
Copy-Item .\chapter-03-coding-agents-ide-control\continue-config.json "$HOME\.continue\config.json" # Copy the checked-in safe model matrix to Continue's user path.
Get-Content "$HOME\.continue\config.json" -Raw | ConvertFrom-Json | Out-Null # Parse JSON and fail if the configuration is malformed.
```

These commands inspect or prepare the local machine so the next operation has a known path and state. They also execute this lab step; the surrounding explanation defines its expected result and reason for inclusion. They also run python for an isolated utility, configuration check, or environment verification.

```bash
mkdir -p ~/.continue ~/.codex ~/.config/opencode         # Create the equivalent Unix configuration folders.
cp chapter-03-coding-agents-ide-control/continue-config.json ~/.continue/config.json # Install the project configuration for the current user.
python3 -m json.tool ~/.continue/config.json >/dev/null   # Validate JSON syntax without printing the full file.
ollama pull qwen2.5-coder:7b                              # Download a local coding model for offline agent work.
ollama pull nomic-embed-text                              # Download a local embedding model for private code retrieval.
```

The user-level path matters: the editor reads it only after restart, while the repository keeps the template reviewable. Local model downloads are optional and consume disk.

These commands create or select an isolated branch so experimental work does not modify the shared branch. They also inspect or change version-controlled project state in an auditable way. They also run the project tool through the configured package-manager/runtime workflow.

```bash
git switch -c lab/agent-controlled-change                    # Isolate the agent experiment from main.
git diff -- chapter-09-automated-verification-testing/concurrency.test.js # Inspect only the allowed file.
pnpm run test:concurrency                                     # Execute the behavior the agent was asked to preserve.
git diff --check                                              # Detect whitespace errors before review.
git status --short                                            # Show every file the agent touched.
git diff --stat                                               # Summarize the size of the change.
git log --oneline -1                                          # Confirm the current commit context.
```

Each inspection command is a different safety signal: scope, behavior, formatting, file set, size, and history.

# Chapter 03 Agent Installation and Configuration Walkthrough

## Installer commands

`npm install --global @openai/codex` places the Codex CLI in the global npm prefix. `opencode-ai` follows the same mechanism. `winget install --id GitHub.cli` installs GitHub's authenticated repository tool. `code --install-extension` asks the VS Code CLI to install an extension by marketplace identifier. Each command installs software; none grants the agent production credentials.

## Configuration commands

`New-Item -ItemType Directory -Force` creates user configuration directories without failing if they already exist. `Copy-Item` places the checked-in Continue configuration at the real per-user path. `ConvertFrom-Json` parses the file and fails if syntax is invalid; `json.tool` performs the same check on POSIX systems.

## Agent task walkthrough

The task prompt defines a goal, limits files, forbids package and behavior changes, names the exact test, and requires a diff report. The follow-up `git diff` inspects the agent's mutation, `pnpm run test:concurrency` executes the behavior, and `git diff --check` detects whitespace errors. This sequence teaches delegation followed by verification, not blind acceptance.

## Completion proof

The learner can locate each agent's user configuration directory, restart an editor after configuration changes, assign a bounded task, inspect the resulting diff, and reject an agent that exceeds its permission boundary.


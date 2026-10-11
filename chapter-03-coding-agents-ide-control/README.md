# Chapter 03: Coding Agents and IDE Control

Treat every agent as an untrusted contributor with least-privilege credentials, a dedicated branch, and an explicit review boundary.

## Terminal agents

Claude Code, OpenCode, Codex CLI, and OpenClaw should run with repository-local instructions, read-only credentials by default, and network access disabled unless the task requires it. Keep secrets in the host credential store and require human approval for migrations, deployments, and destructive commands.

## IDE extensions

Cline, Roo Code, Continue.dev, GitHub Copilot, and Kilo should share the same formatting, lint, test, and commit conventions. Disable automatic command execution for new workspaces. Continue.dev can route requests to hosted models while using a local embedding model so source indexing remains on-device.

Copy `continue-config.json` into the Continue configuration directory, replace environment-variable references through the extension's secret mechanism, and verify the model endpoint before enabling agent mode.


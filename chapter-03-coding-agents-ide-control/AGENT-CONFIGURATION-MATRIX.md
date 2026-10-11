# Agent Configuration Matrix

## Safe baseline

```json
{
  "approvalMode": "on-request",
  "allowNetwork": false,
  "allowDestructiveCommands": false,
  "workspaceOnly": true,
  "maxOutputBytes": 50000
}
```

Map this concept to each tool's native setting rather than copying the JSON blindly. The important invariant is that the agent cannot silently deploy, delete data, rewrite Git history, or read credentials outside the workspace.

## Provider environment

PowerShell user-scoped values:


Run these commands to complete the [Environment]::SetEnvironmentVariable('OPENAI_API_KEY', step and verify its result before continuing.

```powershell
[Environment]::SetEnvironmentVariable('OPENAI_API_KEY', 'use-your-secret-manager', 'User')
[Environment]::SetEnvironmentVariable('ANTHROPIC_API_KEY', 'use-your-secret-manager', 'User')
```

Do not use the command above with a literal production key in a recorded lesson. Prefer `gh secret set`, 1Password CLI, Windows Credential Manager, macOS Keychain, or the platform secret store.

macOS/Linux session values:


Run these commands to load the required configuration into the current process so the following tool can authenticate and use the selected service.

```bash
export OPENAI_API_KEY="$(security find-generic-password -a "$USER" -s launchpad-openai -w)"
```

## Editor command allow-list

Start with read-only commands:

```text
git status
git diff --check
pnpm run test
pnpm run typecheck
```

Promote to write commands only after the agent has shown the intended diff. Database migrations, package installation, Docker commands, cloud deploys, and Git pushes require a separate human approval.

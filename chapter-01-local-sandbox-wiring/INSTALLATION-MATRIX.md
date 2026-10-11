# Chapter 01 Installation Matrix

## Exact verification contract

The shell must resolve one working executable for each row:

| Capability | Windows command | macOS/Linux command |
|---|---|---|
| PowerShell | `pwsh --version` | `pwsh --version` |
| Node | `node --version` | `node --version` |
| npm | `npm.cmd --version` or `npm --version` | `npm --version` |
| pnpm | `pnpm --version` | `pnpm --version` |
| Python | `python --version` | `python3 --version` |
| Git | `git --version` | `git --version` |
| Docker | `docker version` | `docker version` |
| GitHub CLI | `gh --version` | `gh --version` |

## PATH diagnosis

Windows:

```powershell
# What/why: Inspect or prepare the local machine so the next operation has a known path and state.
where.exe node
# What/why: Inspect or prepare the local machine so the next operation has a known path and state.
Get-Command node -All
# What/why: Execute this lab step; the surrounding explanation defines its expected result and reason for inclusion.
[Environment]::GetEnvironmentVariable('Path', 'User') -split ';'
# What/why: Execute this lab step; the surrounding explanation defines its expected result and reason for inclusion.
[Environment]::GetEnvironmentVariable('Path', 'Machine') -split ';'
```

macOS/Linux:

```bash
# What/why: Inspect or prepare the local machine so the next operation has a known path and state.
command -v node
# What/why: Inspect or prepare the local machine so the next operation has a known path and state.
type -a node
# What/why: Send one deterministic protocol request to the process so its response can be verified.
printf '%s\n' "$PATH" | tr ':' '\n'
```

If a new installation is not visible, open a new terminal. Do not edit machine PATH values blindly; add one manager initialization block to the user profile and document it.

## Shell profile locations

| Shell | Profile |
|---|---|
| PowerShell | `$PROFILE` |
| Windows cmd | registry/user PATH |
| Bash | `~/.bashrc` |
| Zsh | `~/.zshrc`, `~/.zprofile` |
| Fish | `~/.config/fish/config.fish` |

Inspect before editing:

```powershell
# What/why: Execute this lab step; the surrounding explanation defines its expected result and reason for inclusion.
Test-Path $PROFILE; if (Test-Path $PROFILE) { Get-Content $PROFILE }
```

```bash
# What/why: Evaluate a local prerequisite or branch condition before continuing the setup.
test -f ~/.zshrc && sed -n '1,160p' ~/.zshrc
```

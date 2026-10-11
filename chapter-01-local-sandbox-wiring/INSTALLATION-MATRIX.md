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


Run these commands to install or execute the project tooling, then verify that the local implementation produces the expected result.

```powershell
where.exe node
Get-Command node -All
[Environment]::GetEnvironmentVariable('Path', 'User') -split ';'
[Environment]::GetEnvironmentVariable('Path', 'Machine') -split ';'
```

macOS/Linux:


Run these commands to install or execute the project tooling, then verify that the local implementation produces the expected result.

```bash
command -v node
type -a node
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


Run these commands to complete the Test-Path step and verify its result before continuing.

```powershell
Test-Path $PROFILE; if (Test-Path $PROFILE) { Get-Content $PROFILE }
```


Run these commands to complete the test step and verify its result before continuing.

```bash
test -f ~/.zshrc && sed -n '1,160p' ~/.zshrc
```

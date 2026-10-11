# Chapter 01 Code and Command Walkthrough

This chapter's purpose is to make the learner's computer predictable before an AI agent is trusted with code. Every installation command either checks a prerequisite, installs one tool, configures a shell, or proves the result.

## Command-by-command explanation

| Command | What each part does | Why it is used |
|---|---|---|
| `Get-Command winget` | PowerShell searches the command path for `winget`. | Confirms App Installer supplied the package manager. |
| `winget --info` | Prints WinGet version, source, and runtime details. | Detects an outdated package manager before installation. |
| `winget install --id Git.Git --exact` | Selects Git by stable package ID and requires an exact match. | Avoids installing a similarly named package. |
| `corepack enable` | Creates package-manager shims next to Node. | Makes the project-selected pnpm executable available. |
| `corepack prepare pnpm@10.6.2 --activate` | Downloads and activates the pinned pnpm version. | Keeps lockfile behavior reproducible. |
| `brew install node python git jq gh` | Homebrew installs runtime, language, VCS, JSON, and GitHub tools. | Provides the same capabilities as the Windows path. |
| `sudo apt-get update` | Refreshes Debian package indexes. | Prevents installing stale package metadata. |
| `python3 -m venv .venv-lab` | Creates an isolated Python interpreter directory. | Keeps Python utilities separate from the host installation. |
| `git clone ...` | Copies the remote repository and its history. | Starts the cumulative course project locally. |
| `pnpm install --frozen-lockfile` | Installs the exact dependency graph and refuses lockfile edits. | Proves the machine can reproduce the project. |
| `pnpm run validate:environment` | Runs the repository's executable environment checks. | Turns “it should work” into evidence. |

## PowerShell audit script

`environment-setup.ps1` uses `Set-StrictMode` to expose undeclared variables, sets `$ErrorActionPreference` to stop on failures, and defines `Get-CommandPath` so missing tools return a visible null instead of aborting the whole report. The `$report` object groups host, policy, TLS, executable, and PATH information. `-Json` is intended for automation; the default formatted output is for a learner reading a terminal.

## Completion proof

The learner should be able to explain why App Installer is needed for Winget, identify where Node and pnpm resolve from, recreate the project in a new directory, and remove `.venv-lab` without affecting system Python.


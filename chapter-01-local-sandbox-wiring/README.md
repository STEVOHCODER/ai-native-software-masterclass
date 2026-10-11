# Chapter 01: Native Local Sandbox Wiring

This chapter establishes a repeatable developer workstation without weakening host security.

## Windows

Run PowerShell as the current user:

```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned -Force
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
irm get.scoop.sh | iex
scoop install git nodejs-lts python
corepack enable
corepack prepare pnpm@latest --activate
node --version
python --version
pnpm --version
```

`RemoteSigned` permits locally authored scripts and requires signatures for scripts downloaded from the internet. TLS 1.2 is explicitly selected for bootstrap traffic; the operating system should negotiate TLS 1.3 when supported. Never disable certificate validation or use `Invoke-WebRequest -SkipCertificateCheck`.

## macOS

```bash
export PATH="/opt/homebrew/bin:/usr/local/bin:$PATH"
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
brew install node python git
corepack enable
corepack prepare pnpm@latest --activate
node --version
python3 --version
pnpm --version
```

Persist the Homebrew path in `~/.zprofile` after confirming the installer output. Use `curl --proto '=https' --tlsv1.2 --fail --silent --show-error --location` for scripted downloads.

## Audit

Run `.\environment-setup.ps1` from this directory. The script reports resolved binaries and path entries, but does not mutate the machine beyond the explicitly requested user execution-policy check.


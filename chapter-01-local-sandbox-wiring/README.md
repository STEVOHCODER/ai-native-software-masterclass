# Chapter 01 — Native Local Sandbox Wiring

## Outcome

By the end of this chapter, a learner can create an isolated project workspace, install the same toolchain on Windows/macOS/Linux, verify interpreter and package-manager versions, configure safe TLS defaults, and diagnose a broken `PATH` without copying secrets into a repository.

The course application is called **Launchpad Hub**: a full-stack learning dashboard that will eventually support AI-assisted lesson planning, progress tracking, telemetry, and a paid corporate deployment. Every later chapter assumes this chapter's checks pass.

## 1. Required hardware and accounts

Use a 64-bit machine with at least 8 GB RAM, 20 GB free disk space, and a current browser. Create accounts only when needed: GitHub, one AI provider, Supabase, MongoDB Atlas, Cloudflare, and a deployment provider. Use a password manager and separate development keys from production keys.

## 2. Windows installation (PowerShell 7)

Open a non-administrator PowerShell window:

```powershell
winget install --id Microsoft.PowerShell --source winget
winget install --id Git.Git --source winget
winget install --id Microsoft.VisualStudioCode --source winget
```

Start PowerShell 7, then install Scoop and the runtimes:

```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned -Force
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
$ProgressPreference = 'SilentlyContinue'
irm get.scoop.sh | iex
scoop bucket add extras
scoop install nodejs-lts python git jq
corepack enable
corepack prepare pnpm@10.6.2 --activate
```

Verify both command discovery and versions:

```powershell
Get-Command node, npm, pnpm, python, pip, git, scoop | Select-Object Name, Source
node --version
npm --version
pnpm --version
python --version
python -m pip --version
git --version
scoop --version
```

If `python` opens the Microsoft Store, disable the Python App Execution Alias in **Settings → Apps → Advanced app settings → App execution aliases**, reopen the terminal, and repeat the audit.

Create a virtual environment for Python utilities:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
python -c "import ssl; print(ssl.OPENSSL_VERSION)"
deactivate
```

## 3. macOS installation (Homebrew)

Install Apple's command-line tools and Homebrew:

```bash
xcode-select --install
/bin/bash -c "$(curl --proto '=https' --tlsv1.2 --fail --silent --show-error --location https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

Configure both Apple Silicon and Intel paths:

```bash
if [ -x /opt/homebrew/bin/brew ]; then
  echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
  eval "$(/opt/homebrew/bin/brew shellenv)"
else
  echo 'eval "$(/usr/local/bin/brew shellenv)"' >> ~/.zprofile
  eval "$(/usr/local/bin/brew shellenv)"
fi
brew update
brew install node python git jq
corepack enable
corepack prepare pnpm@10.6.2 --activate
```

Verify:

```bash
command -v node npm pnpm python3 pip3 git brew
node --version && npm --version && pnpm --version
python3 --version && python3 -m pip --version
python3 -c 'import ssl; print(ssl.OPENSSL_VERSION)'
```

## 4. Linux installation (Ubuntu/Debian)

```bash
sudo apt-get update
sudo apt-get install --yes ca-certificates curl git build-essential python3 python3-venv python3-pip jq
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install --yes nodejs
corepack enable
corepack prepare pnpm@10.6.2 --activate
node --version && python3 --version && pnpm --version
```

For production servers, pin the Node major version through the image or version manager instead of relying on a moving system package.

## 5. TLS and shell safety

PowerShell 5.1 can be configured for TLS 1.2 when a legacy bootstrap requires it:

```powershell
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
```

PowerShell 7 uses the operating system's modern TLS stack; verify negotiation rather than disabling certificate checks:

```powershell
$request = [Net.HttpWebRequest]::Create('https://example.com')
$request.GetResponse().Close()
```

On macOS/Linux, require TLS 1.2 or newer for scripted downloads:

```bash
curl --proto '=https' --tlsv1.2 --fail --silent --show-error --location https://example.com/robots.txt
```

Never use `--insecure`, `-SkipCertificateCheck`, or an unverified `eval` of downloaded content. Inspect bootstrap scripts when the environment is sensitive.

## 6. Clone and initialize the course workspace

```powershell
# Windows
Set-Location D:\MOVIE\Video\Video\clone\MASTER_CLASS
git clone <repository-url> testing-qwen
Set-Location .\testing-qwen\masterclass-hub
```

```bash
# macOS/Linux
git clone <repository-url> testing-qwen
cd testing-qwen/masterclass-hub
```

Install the reproducible dependency graph:

```bash
pnpm install --frozen-lockfile
pnpm run validate:environment
pnpm run test:concurrency
```

## 7. Completion gate

Run `.\environment-setup.ps1 -Json` on Windows or repeat the equivalent commands on macOS/Linux. Record the output in your lesson notes, not in Git. The environment is ready only when Node, package manager, Python, Git, TLS, and repository path checks all pass.


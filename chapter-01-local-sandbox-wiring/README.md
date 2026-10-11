# Chapter 01 — Native Local Sandbox Wiring

## Outcome

By the end of this chapter, a learner can create an isolated project workspace, install the same toolchain on Windows/macOS/Linux, verify interpreter and package-manager versions, configure safe TLS defaults, and diagnose a broken `PATH` without copying secrets into a repository.

The course application is called **Launchpad Hub**: a full-stack learning dashboard that will eventually support AI-assisted lesson planning, progress tracking, telemetry, and a paid corporate deployment. Every later chapter assumes this chapter's checks pass.

## 1. Required hardware and accounts

Use a 64-bit machine with at least 8 GB RAM, 20 GB free disk space, and a current browser. Create accounts only when needed: GitHub, one AI provider, Supabase, MongoDB Atlas, Cloudflare, and a deployment provider. Use a password manager and separate development keys from production keys.

## 2. Windows installation (PowerShell 7)

Open a non-administrator PowerShell window:

```powershell
# What/why: Install the selected Windows package so the required tool is available to later labs.
winget install --id Microsoft.PowerShell --source winget
# What/why: Install the selected Windows package so the required tool is available to later labs.
winget install --id Git.Git --source winget
# What/why: Install the selected Windows package so the required tool is available to later labs.
winget install --id Microsoft.VisualStudioCode --source winget
```

Start PowerShell 7, then install Scoop and the runtimes:

```powershell
# What/why: Create, copy, or configure a real local file/path used by the tool.
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned -Force
# What/why: Execute this lab step; the surrounding explanation defines its expected result and reason for inclusion.
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
# What/why: Execute this lab step; the surrounding explanation defines its expected result and reason for inclusion.
$ProgressPreference = 'SilentlyContinue'
# What/why: Use PowerShell to download or call the service with explicit error behavior.
irm get.scoop.sh | iex
# What/why: Execute this lab step; the surrounding explanation defines its expected result and reason for inclusion.
scoop bucket add extras
# What/why: Install the developer tool through Scoop without requiring machine-wide installation.
scoop install nodejs-lts python git jq
# What/why: Run the project tool through the configured package-manager/runtime workflow.
corepack enable
# What/why: Run the project tool through the configured package-manager/runtime workflow.
corepack prepare pnpm@10.6.2 --activate
```

Verify both command discovery and versions:

```powershell
# What/why: Inspect or prepare the local machine so the next operation has a known path and state.
Get-Command node, npm, pnpm, python, pip, git, scoop | Select-Object Name, Source
# What/why: Run a Node.js script or diagnostic using the project runtime.
node --version
# What/why: Run the project tool through the configured package-manager/runtime workflow.
npm --version
# What/why: Run the project tool through the configured package-manager/runtime workflow.
pnpm --version
# What/why: Run Python for an isolated utility, configuration check, or environment verification.
python --version
# What/why: Run Python for an isolated utility, configuration check, or environment verification.
python -m pip --version
# What/why: Inspect or change version-controlled project state in an auditable way.
git --version
# What/why: Execute this lab step; the surrounding explanation defines its expected result and reason for inclusion.
scoop --version
```

If `python` opens the Microsoft Store, disable the Python App Execution Alias in **Settings → Apps → Advanced app settings → App execution aliases**, reopen the terminal, and repeat the audit.

Create a virtual environment for Python utilities:

```powershell
# What/why: Run Python for an isolated utility, configuration check, or environment verification.
python -m venv .venv
# What/why: Execute this lab step; the surrounding explanation defines its expected result and reason for inclusion.
.\.venv\Scripts\Activate.ps1
# What/why: Run Python for an isolated utility, configuration check, or environment verification.
python -m pip install --upgrade pip
# What/why: Run Python for an isolated utility, configuration check, or environment verification.
python -c "import ssl; print(ssl.OPENSSL_VERSION)"
# What/why: Execute this lab step; the surrounding explanation defines its expected result and reason for inclusion.
deactivate
```

## 3. macOS installation (Homebrew)

Install Apple's command-line tools and Homebrew:

```bash
# What/why: Execute this lab step; the surrounding explanation defines its expected result and reason for inclusion.
xcode-select --install
# What/why: Execute this lab step; the surrounding explanation defines its expected result and reason for inclusion.
/bin/bash -c "$(curl --proto '=https' --tlsv1.2 --fail --silent --show-error --location https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

Configure both Apple Silicon and Intel paths:

```bash
# What/why: Evaluate a local prerequisite or branch condition before continuing the setup.
if [ -x /opt/homebrew/bin/brew ]; then
# What/why: Execute this lab step; the surrounding explanation defines its expected result and reason for inclusion.
  echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
# What/why: Execute this lab step; the surrounding explanation defines its expected result and reason for inclusion.
  eval "$(/opt/homebrew/bin/brew shellenv)"
# What/why: Execute this lab step; the surrounding explanation defines its expected result and reason for inclusion.
else
# What/why: Execute this lab step; the surrounding explanation defines its expected result and reason for inclusion.
  echo 'eval "$(/usr/local/bin/brew shellenv)"' >> ~/.zprofile
# What/why: Execute this lab step; the surrounding explanation defines its expected result and reason for inclusion.
  eval "$(/usr/local/bin/brew shellenv)"
# What/why: Execute this lab step; the surrounding explanation defines its expected result and reason for inclusion.
fi
# What/why: Execute this lab step; the surrounding explanation defines its expected result and reason for inclusion.
brew update
# What/why: Install the required developer tool through Homebrew on macOS.
brew install node python git jq
# What/why: Run the project tool through the configured package-manager/runtime workflow.
corepack enable
# What/why: Run the project tool through the configured package-manager/runtime workflow.
corepack prepare pnpm@10.6.2 --activate
```

Verify:

```bash
# What/why: Inspect or prepare the local machine so the next operation has a known path and state.
command -v node npm pnpm python3 pip3 git brew
# What/why: Run a Node.js script or diagnostic using the project runtime.
node --version && npm --version && pnpm --version
# What/why: Run Python for an isolated utility, configuration check, or environment verification.
python3 --version && python3 -m pip --version
# What/why: Run Python for an isolated utility, configuration check, or environment verification.
python3 -c 'import ssl; print(ssl.OPENSSL_VERSION)'
```

## 4. Linux installation (Ubuntu/Debian)

```bash
# What/why: Refresh Linux package metadata so installation uses current package indexes.
sudo apt-get update
# What/why: Install the runtime or system dependency required by the next lab step.
sudo apt-get install --yes ca-certificates curl git build-essential python3 python3-venv python3-pip jq
# What/why: Fetch the requested HTTPS resource or exercise the HTTP endpoint while failing visibly on errors.
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
# What/why: Install the runtime or system dependency required by the next lab step.
sudo apt-get install --yes nodejs
# What/why: Run the project tool through the configured package-manager/runtime workflow.
corepack enable
# What/why: Run the project tool through the configured package-manager/runtime workflow.
corepack prepare pnpm@10.6.2 --activate
# What/why: Run a Node.js script or diagnostic using the project runtime.
node --version && python3 --version && pnpm --version
```

For production servers, pin the Node major version through the image or version manager instead of relying on a moving system package.

## 5. TLS and shell safety

PowerShell 5.1 can be configured for TLS 1.2 when a legacy bootstrap requires it:

```powershell
# What/why: Execute this lab step; the surrounding explanation defines its expected result and reason for inclusion.
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
```

PowerShell 7 uses the operating system's modern TLS stack; verify negotiation rather than disabling certificate checks:

```powershell
# What/why: Execute this lab step; the surrounding explanation defines its expected result and reason for inclusion.
$request = [Net.HttpWebRequest]::Create('https://example.com')
# What/why: Execute this lab step; the surrounding explanation defines its expected result and reason for inclusion.
$request.GetResponse().Close()
```

On macOS/Linux, require TLS 1.2 or newer for scripted downloads:

```bash
# What/why: Fetch the requested HTTPS resource or exercise the HTTP endpoint while failing visibly on errors.
curl --proto '=https' --tlsv1.2 --fail --silent --show-error --location https://example.com/robots.txt
```

Never use `--insecure`, `-SkipCertificateCheck`, or an unverified `eval` of downloaded content. Inspect bootstrap scripts when the environment is sensitive.

## 6. Clone and initialize the course workspace

```powershell
# Windows
# What/why: Create, copy, or configure a real local file/path used by the tool.
Set-Location D:\MOVIE\Video\Video\clone\MASTER_CLASS
# What/why: Copy the cumulative course repository and its history onto this computer.
git clone <repository-url> testing-qwen
# What/why: Create, copy, or configure a real local file/path used by the tool.
Set-Location .\testing-qwen\masterclass-hub
```

```bash
# macOS/Linux
# What/why: Copy the cumulative course repository and its history onto this computer.
git clone <repository-url> testing-qwen
# What/why: Inspect or prepare the local machine so the next operation has a known path and state.
cd testing-qwen/masterclass-hub
```

Install the reproducible dependency graph:

```bash
# What/why: Install project dependencies using the selected package manager and its lockfile policy.
pnpm install --frozen-lockfile
# What/why: Run the project tool through the configured package-manager/runtime workflow.
pnpm run validate:environment
# What/why: Run the project tool through the configured package-manager/runtime workflow.
pnpm run test:concurrency
```

## 7. Completion gate

Run `.\environment-setup.ps1 -Json` on Windows or repeat the equivalent commands on macOS/Linux. Record the output in your lesson notes, not in Git. The environment is ready only when Node, package manager, Python, Git, TLS, and repository path checks all pass.

## 8. Installer decision matrix

`winget` is Microsoft's package manager and is normally delivered through **App Installer** on supported Windows 10/11 systems. Confirm it before using it:

```powershell
# What/why: Inspect or prepare the local machine so the next operation has a known path and state.
Get-Command winget
# What/why: Inspect or operate the Windows package manager before changing the workstation.
winget --info
```

If it is missing, update **App Installer** from Microsoft Store, or use one of the independent paths below.

| Platform | Node.js | Python | pnpm | Best use |
|---|---|---|---|---|
| Windows | `winget`, Scoop, Chocolatey, official MSI, `nvm-windows` | `winget`, Scoop, Chocolatey, official installer | Corepack or `npm install --global pnpm` | corporate Windows |
| macOS | Homebrew, official pkg, `nvm`, `fnm` | Homebrew, official pkg, `pyenv` | Corepack or Homebrew | Apple Silicon/Intel |
| Linux | distro package, NodeSource, `nvm`, `fnm` | apt/dnf, `pyenv` | Corepack or npm | CI and servers |

Alternative Windows installations:

```powershell
# Chocolatey (PowerShell as Administrator)
# What/why: Create, copy, or configure a real local file/path used by the tool.
Set-ExecutionPolicy Bypass -Scope Process -Force
# What/why: Execute this lab step; the surrounding explanation defines its expected result and reason for inclusion.
[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
# What/why: Use PowerShell to download or call the service with explicit error behavior.
irm https://community.chocolatey.org/install.ps1 | iex
# What/why: Execute this lab step; the surrounding explanation defines its expected result and reason for inclusion.
choco install nodejs-lts python git jq -y

# Scoop (non-administrator)
# What/why: Install the developer tool through Scoop without requiring machine-wide installation.
scoop install nodejs-lts python git jq

# Official Node installer
# Download the current LTS x64 MSI from https://nodejs.org/en/download,
# then run the downloaded file from its real path:
# What/why: Execute this lab step; the surrounding explanation defines its expected result and reason for inclusion.
Start-Process msiexec.exe -Wait -ArgumentList '/i', '.\node-v22.14.0-x64.msi'
```

Prefer a version manager when learners need multiple projects:

```powershell
# fnm via winget
# What/why: Install the selected Windows package so the required tool is available to later labs.
winget install Schniz.fnm
# What/why: Execute this lab step; the surrounding explanation defines its expected result and reason for inclusion.
fnm env --use-on-cd | Out-String | Invoke-Expression
# What/why: Execute this lab step; the surrounding explanation defines its expected result and reason for inclusion.
fnm install 22
# What/why: Execute this lab step; the surrounding explanation defines its expected result and reason for inclusion.
fnm use 22
```

```bash
# macOS/Linux with nvm
# What/why: Fetch the requested HTTPS resource or exercise the HTTP endpoint while failing visibly on errors.
curl --proto '=https' --tlsv1.2 --fail --silent --show-error https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
# What/why: Execute this lab step; the surrounding explanation defines its expected result and reason for inclusion.
nvm install 22
# What/why: Execute this lab step; the surrounding explanation defines its expected result and reason for inclusion.
nvm alias default 22
# What/why: Run the project tool through the configured package-manager/runtime workflow.
corepack enable
```

The course uses Corepack-pinned pnpm where possible. When Corepack is unavailable:

```powershell
# What/why: Install project dependencies using the selected package manager and its lockfile policy.
npm install --global pnpm@10.6.2
```

```bash
# What/why: Execute this lab step; the surrounding explanation defines its expected result and reason for inclusion.
sudo npm install --global pnpm@10.6.2
```

## Learn by executing

Run [`LAB.md`](LAB.md) for the complete workstation exercise. Every command is annotated inline, and the final section explains what each command does and why it appears in that order. [`EXPLAINED.md`](EXPLAINED.md) adds the architecture walkthrough.

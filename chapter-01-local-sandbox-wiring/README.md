# Chapter 01 — Native Local Sandbox Wiring

## Outcome

By the end of this chapter, a learner can create an isolated project workspace, install the same toolchain on Windows/macOS/Linux, verify interpreter and package-manager versions, configure safe TLS defaults, and diagnose a broken `PATH` without copying secrets into a repository.

The course application is called **Launchpad Hub**: a full-stack learning dashboard that will eventually support AI-assisted lesson planning, progress tracking, telemetry, and a paid corporate deployment. Every later chapter assumes this chapter's checks pass.

## 1. Required hardware and accounts

Use a 64-bit machine with at least 8 GB RAM, 20 GB free disk space, and a current browser. Create accounts only when needed: GitHub, one AI provider, Supabase, MongoDB Atlas, Cloudflare, and a deployment provider. Use a password manager and separate development keys from production keys.

## 2. Windows installation (PowerShell 7)

Open a non-administrator PowerShell window:

These commands install the selected Windows package so the required tool is available to later labs.

```powershell
winget install --id Microsoft.PowerShell --source winget
winget install --id Git.Git --source winget
winget install --id Microsoft.VisualStudioCode --source winget
```

Start PowerShell 7, then install Scoop and the runtimes:

These commands create, copy, or configure a real local file/path used by the tool. They also execute this lab step; the surrounding explanation defines its expected result and reason for inclusion. They also use powershell to download or call the service with explicit error behavior. They also install the developer tool through scoop without requiring machine-wide installation. They also run the project tool through the configured package-manager/runtime workflow.

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

These commands inspect or prepare the local machine so the next operation has a known path and state. They also run a node.js script or diagnostic using the project runtime. They also run the project tool through the configured package-manager/runtime workflow. They also run python for an isolated utility, configuration check, or environment verification. They also inspect or change version-controlled project state in an auditable way. They also execute this lab step; the surrounding explanation defines its expected result and reason for inclusion.

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

These commands run python for an isolated utility, configuration check, or environment verification. They also execute this lab step; the surrounding explanation defines its expected result and reason for inclusion.

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
python -c "import ssl; print(ssl.OPENSSL_VERSION)"
deactivate
```

## 3. macOS installation (Homebrew)

Install Apple's command-line tools and Homebrew:

These commands execute this lab step; the surrounding explanation defines its expected result and reason for inclusion.

```bash
xcode-select --install
/bin/bash -c "$(curl --proto '=https' --tlsv1.2 --fail --silent --show-error --location https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

Configure both Apple Silicon and Intel paths:

These commands evaluate a local prerequisite or branch condition before continuing the setup. They also execute this lab step; the surrounding explanation defines its expected result and reason for inclusion. They also install the required developer tool through homebrew on macos. They also run the project tool through the configured package-manager/runtime workflow.

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

These commands inspect or prepare the local machine so the next operation has a known path and state. They also run a node.js script or diagnostic using the project runtime. They also run python for an isolated utility, configuration check, or environment verification.

```bash
command -v node npm pnpm python3 pip3 git brew
node --version && npm --version && pnpm --version
python3 --version && python3 -m pip --version
python3 -c 'import ssl; print(ssl.OPENSSL_VERSION)'
```

## 4. Linux installation (Ubuntu/Debian)

These commands refresh linux package metadata so installation uses current package indexes. They also install the runtime or system dependency required by the next lab step. They also fetch the requested https resource or exercise the http endpoint while failing visibly on errors. They also run the project tool through the configured package-manager/runtime workflow. They also run a node.js script or diagnostic using the project runtime.

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

These commands execute this lab step; the surrounding explanation defines its expected result and reason for inclusion.

```powershell
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
```

PowerShell 7 uses the operating system's modern TLS stack; verify negotiation rather than disabling certificate checks:

These commands execute this lab step; the surrounding explanation defines its expected result and reason for inclusion.

```powershell
$request = [Net.HttpWebRequest]::Create('https://example.com')
$request.GetResponse().Close()
```

On macOS/Linux, require TLS 1.2 or newer for scripted downloads:

These commands fetch the requested HTTPS resource or exercise the HTTP endpoint while failing visibly on errors.

```bash
curl --proto '=https' --tlsv1.2 --fail --silent --show-error --location https://example.com/robots.txt
```

Never use `--insecure`, `-SkipCertificateCheck`, or an unverified `eval` of downloaded content. Inspect bootstrap scripts when the environment is sensitive.

## 6. Clone and initialize the course workspace

These commands create, copy, or configure a real local file/path used by the tool. They also copy the cumulative course repository and its history onto this computer.

```powershell
# Windows
Set-Location D:\MOVIE\Video\Video\clone\MASTER_CLASS
git clone <repository-url> testing-qwen
Set-Location .\testing-qwen\masterclass-hub
```

These commands copy the cumulative course repository and its history onto this computer. They also inspect or prepare the local machine so the next operation has a known path and state.

```bash
# macOS/Linux
git clone <repository-url> testing-qwen
cd testing-qwen/masterclass-hub
```

Install the reproducible dependency graph:

These commands install project dependencies using the selected package manager and its lockfile policy. They also run the project tool through the configured package-manager/runtime workflow.

```bash
pnpm install --frozen-lockfile
pnpm run validate:environment
pnpm run test:concurrency
```

## 7. Completion gate

Run `.\environment-setup.ps1 -Json` on Windows or repeat the equivalent commands on macOS/Linux. Record the output in your lesson notes, not in Git. The environment is ready only when Node, package manager, Python, Git, TLS, and repository path checks all pass.

## 8. Installer decision matrix

`winget` is Microsoft's package manager and is normally delivered through **App Installer** on supported Windows 10/11 systems. Confirm it before using it:

These commands inspect or prepare the local machine so the next operation has a known path and state. They also inspect or operate the windows package manager before changing the workstation.

```powershell
Get-Command winget
winget --info
```

If it is missing, update **App Installer** from Microsoft Store, or use one of the independent paths below.

| Platform | Node.js | Python | pnpm | Best use |
|---|---|---|---|---|
| Windows | `winget`, Scoop, Chocolatey, official MSI, `nvm-windows` | `winget`, Scoop, Chocolatey, official installer | Corepack or `npm install --global pnpm` | corporate Windows |
| macOS | Homebrew, official pkg, `nvm`, `fnm` | Homebrew, official pkg, `pyenv` | Corepack or Homebrew | Apple Silicon/Intel |
| Linux | distro package, NodeSource, `nvm`, `fnm` | apt/dnf, `pyenv` | Corepack or npm | CI and servers |

Alternative Windows installations:

These commands create, copy, or configure a real local file/path used by the tool. They also execute this lab step; the surrounding explanation defines its expected result and reason for inclusion. They also use powershell to download or call the service with explicit error behavior. They also install the developer tool through scoop without requiring machine-wide installation.

```powershell
# Chocolatey (PowerShell as Administrator)
Set-ExecutionPolicy Bypass -Scope Process -Force
[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
irm https://community.chocolatey.org/install.ps1 | iex
choco install nodejs-lts python git jq -y

# Scoop (non-administrator)
scoop install nodejs-lts python git jq

# Official Node installer
# Download the current LTS x64 MSI from https://nodejs.org/en/download,
# then run the downloaded file from its real path:
Start-Process msiexec.exe -Wait -ArgumentList '/i', '.\node-v22.14.0-x64.msi'
```

Prefer a version manager when learners need multiple projects:

These commands install the selected windows package so the required tool is available to later labs. They also execute this lab step; the surrounding explanation defines its expected result and reason for inclusion.

```powershell
# fnm via winget
winget install Schniz.fnm
fnm env --use-on-cd | Out-String | Invoke-Expression
fnm install 22
fnm use 22
```

These commands fetch the requested https resource or exercise the http endpoint while failing visibly on errors. They also execute this lab step; the surrounding explanation defines its expected result and reason for inclusion. They also run the project tool through the configured package-manager/runtime workflow.

```bash
# macOS/Linux with nvm
curl --proto '=https' --tlsv1.2 --fail --silent --show-error https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
nvm install 22
nvm alias default 22
corepack enable
```

The course uses Corepack-pinned pnpm where possible. When Corepack is unavailable:

These commands install project dependencies using the selected package manager and its lockfile policy.

```powershell
npm install --global pnpm@10.6.2
```

These commands execute this lab step; the surrounding explanation defines its expected result and reason for inclusion.

```bash
sudo npm install --global pnpm@10.6.2
```

## Learn by executing

Run [`LAB.md`](LAB.md) for the complete workstation exercise. Every command is annotated inline, and the final section explains what each command does and why it appears in that order. [`EXPLAINED.md`](EXPLAINED.md) adds the architecture walkthrough.

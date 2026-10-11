# Practical Lab 01 — Build and Prove Your Local Engineering Workstation

## Starting point

Use your own Windows, macOS, or Ubuntu/Debian computer. You need administrator access only for system package installation. You do not need an AI API key yet.

## Installation

Choose one path, then run the verification block for your operating system.

### Windows: Winget

`winget` is delivered through Microsoft's **App Installer**. Open Microsoft Store, search for **App Installer**, install/update it, then open PowerShell:

```powershell
Get-Command winget
winget --info
winget install --id Git.Git --exact
winget install --id OpenJS.NodeJS.LTS --exact
winget install --id Python.Python.3.12 --exact
winget install --id Microsoft.VisualStudioCode --exact
winget install --id Docker.DockerDesktop --exact
winget install --id GitHub.cli --exact
```

### Windows: Scoop alternative

```powershell
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned -Force
irm get.scoop.sh | iex
scoop bucket add extras
scoop install git nodejs-lts python vscode docker gh
```

### macOS: Homebrew

```bash
xcode-select --install
/bin/bash -c "$(curl --proto '=https' --tlsv1.2 --fail --silent --show-error --location https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
brew install node python git jq gh
brew install --cask visual-studio-code docker
```

### Ubuntu/Debian

```bash
sudo apt-get update
sudo apt-get install --yes ca-certificates curl git build-essential python3 python3-venv python3-pip jq
curl --proto '=https' --tlsv1.2 --fail --silent --show-error https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install --yes nodejs
sudo snap install code --classic
```

## Configuration

Enable pnpm through Corepack and create the project workspace:

```powershell
# Windows PowerShell
corepack enable
corepack prepare pnpm@10.6.2 --activate
New-Item -ItemType Directory -Force "$HOME\src\launchpad-hub" | Out-Null
Set-Location "$HOME\src\launchpad-hub"
```

```bash
# macOS/Linux
corepack enable
corepack prepare pnpm@10.6.2 --activate
mkdir -p "$HOME/src/launchpad-hub"
cd "$HOME/src/launchpad-hub"
```

Configure a safe Git identity and user-level execution policy:

```powershell
git config --global init.defaultBranch main
git config --global pull.rebase true
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned -Force
```

```bash
git config --global init.defaultBranch main
git config --global pull.rebase true
```

## Execution

Clone the published course and run its environment audit:

```bash
git clone https://github.com/STEVOHCODER/ai-native-software-masterclass.git
cd ai-native-software-masterclass
pnpm install --frozen-lockfile
```

Windows:

```powershell
.\chapter-01-local-sandbox-wiring\environment-setup.ps1 -Json
```

macOS/Linux:

```bash
node --version
python3 --version
git --version
docker version
gh --version
```

## Expected result

The audit prints paths for Node, npm, pnpm, Python, Git, Docker, Scoop/Winget where available, and GitHub CLI. `pnpm install --frozen-lockfile` completes without modifying the lockfile.

## Verification

```bash
pnpm run validate:environment
git diff --exit-code
```

Create a Python isolation check:

```bash
python3 -m venv .venv-lab
```

Windows:

```powershell
python -m venv .venv-lab
.\.venv-lab\Scripts\python.exe -c "import ssl; print(ssl.OPENSSL_VERSION)"
Remove-Item .venv-lab -Recurse -Force
```

## Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| `winget` not found | App Installer missing/outdated | Update App Installer from Microsoft Store, reopen PowerShell |
| `pnpm` not found | Corepack not enabled | Run `corepack enable`, open a new terminal |
| `python` opens Store | Windows alias intercepts command | Disable Python App Execution Alias or use `py -3` |
| Docker daemon unavailable | Docker Desktop/Engine is not running | Start Docker, then rerun `docker version` |
| `gh auth` fails | CLI is installed but unauthenticated | Run `gh auth login` |
| frozen install changes lockfile | Wrong package-manager version | Use pnpm `10.6.2` exactly |

## Completion criteria

You may continue only when the required runtimes resolve, the repository installs from the lockfile, the Git identity is configured, and the environment audit output has been saved outside Git.


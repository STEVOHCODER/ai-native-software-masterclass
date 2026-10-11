# Practical Lab 01 — Build and Prove Your Local Engineering Workstation

## Starting point

Use your own Windows, macOS, or Ubuntu/Debian computer. You need administrator access only for system package installation. You do not need an AI API key yet.

## Installation

Choose one path, then run the verification block for your operating system.

### Windows: Winget

`winget` is delivered through Microsoft's **App Installer**. Open Microsoft Store, search for **App Installer**, install/update it, then open PowerShell:

These commands inspect or prepare the local machine so the next operation has a known path and state. They also inspect or operate the windows package manager before changing the workstation. They also install the selected windows package so the required tool is available to later labs.

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

These commands create, copy, or configure a real local file/path used by the tool. They also use powershell to download or call the service with explicit error behavior. They also execute this lab step; the surrounding explanation defines its expected result and reason for inclusion. They also install the developer tool through scoop without requiring machine-wide installation.

```powershell
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned -Force
irm get.scoop.sh | iex
scoop bucket add extras
scoop install git nodejs-lts python vscode docker gh
```

### macOS: Homebrew

These commands execute this lab step; the surrounding explanation defines its expected result and reason for inclusion. They also install the required developer tool through homebrew on macos.

```bash
xcode-select --install
/bin/bash -c "$(curl --proto '=https' --tlsv1.2 --fail --silent --show-error --location https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
brew install node python git jq gh
brew install --cask visual-studio-code docker
```

### Ubuntu/Debian

These commands refresh linux package metadata so installation uses current package indexes. They also install the runtime or system dependency required by the next lab step. They also fetch the requested https resource or exercise the http endpoint while failing visibly on errors. They also execute this lab step; the surrounding explanation defines its expected result and reason for inclusion.

```bash
sudo apt-get update
sudo apt-get install --yes ca-certificates curl git build-essential python3 python3-venv python3-pip jq
curl --proto '=https' --tlsv1.2 --fail --silent --show-error https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install --yes nodejs
sudo snap install code --classic
```

## Configuration

Enable pnpm through Corepack and create the project workspace:

These commands run the project tool through the configured package-manager/runtime workflow. They also create, copy, or configure a real local file/path used by the tool.

```powershell
# Windows PowerShell
corepack enable
corepack prepare pnpm@10.6.2 --activate
New-Item -ItemType Directory -Force "$HOME\src\launchpad-hub" | Out-Null
Set-Location "$HOME\src\launchpad-hub"
```

These commands run the project tool through the configured package-manager/runtime workflow. They also inspect or prepare the local machine so the next operation has a known path and state.

```bash
# macOS/Linux
corepack enable
corepack prepare pnpm@10.6.2 --activate
mkdir -p "$HOME/src/launchpad-hub"
cd "$HOME/src/launchpad-hub"
```

Configure a safe Git identity and user-level execution policy:

These commands set the git behavior needed for reproducible collaboration and agent review. They also create, copy, or configure a real local file/path used by the tool.

```powershell
git config --global init.defaultBranch main
git config --global pull.rebase true
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned -Force
```

These commands set the Git behavior needed for reproducible collaboration and agent review.

```bash
git config --global init.defaultBranch main
git config --global pull.rebase true
```

## Execution

Clone the published course and run its environment audit:

These commands copy the cumulative course repository and its history onto this computer. They also inspect or prepare the local machine so the next operation has a known path and state. They also install project dependencies using the selected package manager and its lockfile policy.

```bash
git clone https://github.com/STEVOHCODER/ai-native-software-masterclass.git
cd ai-native-software-masterclass
pnpm install --frozen-lockfile
```

Windows:

These commands execute this lab step; the surrounding explanation defines its expected result and reason for inclusion.

```powershell
.\chapter-01-local-sandbox-wiring\environment-setup.ps1 -Json
```

macOS/Linux:

These commands run a node.js script or diagnostic using the project runtime. They also run python for an isolated utility, configuration check, or environment verification. They also inspect or change version-controlled project state in an auditable way. They also inspect or operate the local container runtime used by the course. They also use the authenticated github cli for repository, pull-request, or release operations.

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

These commands run the project tool through the configured package-manager/runtime workflow. They also inspect or change version-controlled project state in an auditable way.

```bash
pnpm run validate:environment
git diff --exit-code
```

Create a Python isolation check:

These commands run Python for an isolated utility, configuration check, or environment verification.

```bash
python3 -m venv .venv-lab
```

Windows:

These commands run python for an isolated utility, configuration check, or environment verification. They also execute this lab step; the surrounding explanation defines its expected result and reason for inclusion. They also remove only the named temporary lab artifact after its verification is complete.

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

## Command annotations: what and why

The comments below are intentionally next to the commands learners execute.

These commands inspect or prepare the local machine so the next operation has a known path and state. They also inspect or operate the windows package manager before changing the workstation. They also install the selected windows package so the required tool is available to later labs.

```powershell
Get-Command winget                                      # Locate WinGet and show the executable PowerShell will run.
winget --info                                           # Display WinGet/App Installer details before installing packages.
winget install --id Git.Git --exact                     # Install Git by its exact Microsoft package identifier.
winget install --id OpenJS.NodeJS.LTS --exact           # Install the Node.js long-term-support runtime and npm.
winget install --id Python.Python.3.12 --exact          # Install the Python interpreter used by automation utilities.
winget install --id Microsoft.VisualStudioCode --exact  # Install the editor used to inspect agent changes.
winget install --id Docker.DockerDesktop --exact        # Install the local container engine used for database/API labs.
winget install --id GitHub.cli --exact                  # Install gh for authenticated repository and pull-request work.
```

`winget` is available because Microsoft App Installer supplies it; updating App Installer fixes the common “command not found” failure. The exact IDs prevent a similarly named package from being selected.

These commands create, copy, or configure a real local file/path used by the tool. They also use powershell to download or call the service with explicit error behavior. They also execute this lab step; the surrounding explanation defines its expected result and reason for inclusion. They also install the developer tool through scoop without requiring machine-wide installation.

```powershell
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned -Force # Permit local scripts while requiring signatures for downloaded scripts.
irm get.scoop.sh | iex                                  # Download Scoop's installer and execute it in the current PowerShell process.
scoop bucket add extras                                 # Add Scoop's community bucket for additional developer packages.
scoop install git nodejs-lts python vscode docker gh     # Install the same tool categories without administrator access.
```

`RemoteSigned` is scoped to the current user so the lesson does not weaken the whole machine. Review a downloaded installer before executing it; the command is convenient, not a substitute for source verification.

These commands execute this lab step; the surrounding explanation defines its expected result and reason for inclusion. They also install the required developer tool through homebrew on macos. They also refresh linux package metadata so installation uses current package indexes. They also install the runtime or system dependency required by the next lab step. They also fetch the requested https resource or exercise the http endpoint while failing visibly on errors.

```bash
xcode-select --install                                  # Install Apple's compiler tools required by Homebrew and native packages.
brew install node python git jq gh                      # Install the runtime, language, version control, JSON, and GitHub tools.
brew install --cask visual-studio-code docker            # Install GUI applications through Homebrew Cask.
sudo apt-get update                                     # Refresh Debian package indexes before installation.
sudo apt-get install --yes ca-certificates curl git build-essential python3 python3-venv python3-pip jq # Install TLS, download, build, Python, and JSON prerequisites.
curl --proto '=https' --tlsv1.2 --fail --silent --show-error https://deb.nodesource.com/setup_22.x | sudo -E bash - # Add the Node 22 repository using verified TLS.
sudo apt-get install --yes nodejs                       # Install Node.js from the configured repository.
sudo snap install code --classic                        # Install VS Code from Snap with its required confinement allowance.
```

The macOS commands install prerequisites before Homebrew packages. The Linux commands refresh metadata, install build tools, add a pinned Node major version, then install the editor; the order prevents missing compiler or package-index errors.

These commands run the project tool through the configured package-manager/runtime workflow. They also create, copy, or configure a real local file/path used by the tool.

```powershell
corepack enable                                          # Create package-manager shims managed by the installed Node runtime.
corepack prepare pnpm@10.6.2 --activate                 # Activate the exact pnpm version expected by the lockfile.
New-Item -ItemType Directory -Force "$HOME\src\launchpad-hub" | Out-Null # Create the learner workspace idempotently.
Set-Location "$HOME\src\launchpad-hub"                  # Make the new workspace the current directory.
```

These commands run the project tool through the configured package-manager/runtime workflow. They also inspect or prepare the local machine so the next operation has a known path and state.

```bash
corepack enable                                          # Make pnpm available through Node's package-manager shim.
corepack prepare pnpm@10.6.2 --activate                 # Pin pnpm so installs reproduce across machines.
mkdir -p "$HOME/src/launchpad-hub"                      # Create the workspace and its parents if necessary.
cd "$HOME/src/launchpad-hub"                             # Enter the workspace for subsequent commands.
```

`--force` on `New-Item`/`-Force` and `mkdir -p` make rerunning the lab safe. The pinned pnpm version prevents lockfile churn.

These commands set the git behavior needed for reproducible collaboration and agent review. They also create, copy, or configure a real local file/path used by the tool.

```powershell
git config --global init.defaultBranch main              # Make new repositories start on the protected branch name.
git config --global pull.rebase true                     # Replay local commits instead of creating accidental merge commits.
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned -Force # Allow this user's local PowerShell automation.
```

These commands set the Git behavior needed for reproducible collaboration and agent review.

```bash
git config --global init.defaultBranch main              # Standardize the initial branch name.
git config --global pull.rebase true                     # Keep pulls linear and easier for agent review.
```

These commands copy the cumulative course repository and its history onto this computer. They also inspect or prepare the local machine so the next operation has a known path and state. They also install project dependencies using the selected package manager and its lockfile policy.

```bash
git clone https://github.com/STEVOHCODER/ai-native-software-masterclass.git # Copy the cumulative course repository and history.
cd ai-native-software-masterclass                       # Enter the cloned project.
pnpm install --frozen-lockfile                            # Reproduce the exact dependency graph without editing the lockfile.
```

These commands execute this lab step; the surrounding explanation defines its expected result and reason for inclusion.

```powershell
.\chapter-01-local-sandbox-wiring\environment-setup.ps1 -Json # Run the Windows audit and emit machine-readable results.
```

These commands run a node.js script or diagnostic using the project runtime. They also run python for an isolated utility, configuration check, or environment verification. They also inspect or change version-controlled project state in an auditable way. They also inspect or operate the local container runtime used by the course. They also use the authenticated github cli for repository, pull-request, or release operations.

```bash
node --version                                           # Prove the JavaScript runtime is on PATH.
python3 --version                                        # Prove Python is available for utilities and scripts.
git --version                                            # Prove source control is installed.
docker version                                           # Prove the Docker client can reach its daemon.
gh --version                                             # Prove GitHub CLI is available for later agent workflows.
```

These commands run the project tool through the configured package-manager/runtime workflow. They also inspect or change version-controlled project state in an auditable way. They also run python for an isolated utility, configuration check, or environment verification.

```bash
pnpm run validate:environment                            # Execute the repository's cross-platform prerequisite check.
git diff --exit-code                                     # Prove setup did not modify tracked project files.
python3 -m venv .venv-lab                                # Create an isolated Python environment for the lab.
```

The verification commands turn installation into evidence. `git diff --exit-code` is especially important: a setup process should not silently rewrite course code.

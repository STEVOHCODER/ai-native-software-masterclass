# Practical Lab 01 — Build and Prove Your Local Engineering Workstation

## Starting point

Use your own Windows, macOS, or Ubuntu/Debian computer. You need administrator access only for system package installation. You do not need an AI API key yet.

## Installation

Choose one path, then run the verification block for your operating system.

### Windows: Winget

`winget` is delivered through Microsoft's **App Installer**. Open Microsoft Store, search for **App Installer**, install/update it, then open PowerShell:

```powershell
# What/why: Inspect or prepare the local machine so the next operation has a known path and state.
Get-Command winget
# What/why: Inspect or operate the Windows package manager before changing the workstation.
winget --info
# What/why: Install the selected Windows package so the required tool is available to later labs.
winget install --id Git.Git --exact
# What/why: Install the selected Windows package so the required tool is available to later labs.
winget install --id OpenJS.NodeJS.LTS --exact
# What/why: Install the selected Windows package so the required tool is available to later labs.
winget install --id Python.Python.3.12 --exact
# What/why: Install the selected Windows package so the required tool is available to later labs.
winget install --id Microsoft.VisualStudioCode --exact
# What/why: Install the selected Windows package so the required tool is available to later labs.
winget install --id Docker.DockerDesktop --exact
# What/why: Install the selected Windows package so the required tool is available to later labs.
winget install --id GitHub.cli --exact
```

### Windows: Scoop alternative

```powershell
# What/why: Create, copy, or configure a real local file/path used by the tool.
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned -Force
# What/why: Use PowerShell to download or call the service with explicit error behavior.
irm get.scoop.sh | iex
# What/why: Execute this lab step; the surrounding explanation defines its expected result and reason for inclusion.
scoop bucket add extras
# What/why: Install the developer tool through Scoop without requiring machine-wide installation.
scoop install git nodejs-lts python vscode docker gh
```

### macOS: Homebrew

```bash
# What/why: Execute this lab step; the surrounding explanation defines its expected result and reason for inclusion.
xcode-select --install
# What/why: Execute this lab step; the surrounding explanation defines its expected result and reason for inclusion.
/bin/bash -c "$(curl --proto '=https' --tlsv1.2 --fail --silent --show-error --location https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
# What/why: Install the required developer tool through Homebrew on macOS.
brew install node python git jq gh
# What/why: Install the required developer tool through Homebrew on macOS.
brew install --cask visual-studio-code docker
```

### Ubuntu/Debian

```bash
# What/why: Refresh Linux package metadata so installation uses current package indexes.
sudo apt-get update
# What/why: Install the runtime or system dependency required by the next lab step.
sudo apt-get install --yes ca-certificates curl git build-essential python3 python3-venv python3-pip jq
# What/why: Fetch the requested HTTPS resource or exercise the HTTP endpoint while failing visibly on errors.
curl --proto '=https' --tlsv1.2 --fail --silent --show-error https://deb.nodesource.com/setup_22.x | sudo -E bash -
# What/why: Install the runtime or system dependency required by the next lab step.
sudo apt-get install --yes nodejs
# What/why: Execute this lab step; the surrounding explanation defines its expected result and reason for inclusion.
sudo snap install code --classic
```

## Configuration

Enable pnpm through Corepack and create the project workspace:

```powershell
# Windows PowerShell
# What/why: Run the project tool through the configured package-manager/runtime workflow.
corepack enable
# What/why: Run the project tool through the configured package-manager/runtime workflow.
corepack prepare pnpm@10.6.2 --activate
# What/why: Create, copy, or configure a real local file/path used by the tool.
New-Item -ItemType Directory -Force "$HOME\src\launchpad-hub" | Out-Null
# What/why: Create, copy, or configure a real local file/path used by the tool.
Set-Location "$HOME\src\launchpad-hub"
```

```bash
# macOS/Linux
# What/why: Run the project tool through the configured package-manager/runtime workflow.
corepack enable
# What/why: Run the project tool through the configured package-manager/runtime workflow.
corepack prepare pnpm@10.6.2 --activate
# What/why: Inspect or prepare the local machine so the next operation has a known path and state.
mkdir -p "$HOME/src/launchpad-hub"
# What/why: Inspect or prepare the local machine so the next operation has a known path and state.
cd "$HOME/src/launchpad-hub"
```

Configure a safe Git identity and user-level execution policy:

```powershell
# What/why: Set the Git behavior needed for reproducible collaboration and agent review.
git config --global init.defaultBranch main
# What/why: Set the Git behavior needed for reproducible collaboration and agent review.
git config --global pull.rebase true
# What/why: Create, copy, or configure a real local file/path used by the tool.
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned -Force
```

```bash
# What/why: Set the Git behavior needed for reproducible collaboration and agent review.
git config --global init.defaultBranch main
# What/why: Set the Git behavior needed for reproducible collaboration and agent review.
git config --global pull.rebase true
```

## Execution

Clone the published course and run its environment audit:

```bash
# What/why: Copy the cumulative course repository and its history onto this computer.
git clone https://github.com/STEVOHCODER/ai-native-software-masterclass.git
# What/why: Inspect or prepare the local machine so the next operation has a known path and state.
cd ai-native-software-masterclass
# What/why: Install project dependencies using the selected package manager and its lockfile policy.
pnpm install --frozen-lockfile
```

Windows:

```powershell
# What/why: Execute this lab step; the surrounding explanation defines its expected result and reason for inclusion.
.\chapter-01-local-sandbox-wiring\environment-setup.ps1 -Json
```

macOS/Linux:

```bash
# What/why: Run a Node.js script or diagnostic using the project runtime.
node --version
# What/why: Run Python for an isolated utility, configuration check, or environment verification.
python3 --version
# What/why: Inspect or change version-controlled project state in an auditable way.
git --version
# What/why: Inspect or operate the local container runtime used by the course.
docker version
# What/why: Use the authenticated GitHub CLI for repository, pull-request, or release operations.
gh --version
```

## Expected result

The audit prints paths for Node, npm, pnpm, Python, Git, Docker, Scoop/Winget where available, and GitHub CLI. `pnpm install --frozen-lockfile` completes without modifying the lockfile.

## Verification

```bash
# What/why: Run the project tool through the configured package-manager/runtime workflow.
pnpm run validate:environment
# What/why: Inspect or change version-controlled project state in an auditable way.
git diff --exit-code
```

Create a Python isolation check:

```bash
# What/why: Run Python for an isolated utility, configuration check, or environment verification.
python3 -m venv .venv-lab
```

Windows:

```powershell
# What/why: Run Python for an isolated utility, configuration check, or environment verification.
python -m venv .venv-lab
# What/why: Execute this lab step; the surrounding explanation defines its expected result and reason for inclusion.
.\.venv-lab\Scripts\python.exe -c "import ssl; print(ssl.OPENSSL_VERSION)"
# What/why: Remove only the named temporary lab artifact after its verification is complete.
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

```powershell
# What/why: Inspect or prepare the local machine so the next operation has a known path and state.
Get-Command winget                                      # Locate WinGet and show the executable PowerShell will run.
# What/why: Inspect or operate the Windows package manager before changing the workstation.
winget --info                                           # Display WinGet/App Installer details before installing packages.
# What/why: Install the selected Windows package so the required tool is available to later labs.
winget install --id Git.Git --exact                     # Install Git by its exact Microsoft package identifier.
# What/why: Install the selected Windows package so the required tool is available to later labs.
winget install --id OpenJS.NodeJS.LTS --exact           # Install the Node.js long-term-support runtime and npm.
# What/why: Install the selected Windows package so the required tool is available to later labs.
winget install --id Python.Python.3.12 --exact          # Install the Python interpreter used by automation utilities.
# What/why: Install the selected Windows package so the required tool is available to later labs.
winget install --id Microsoft.VisualStudioCode --exact  # Install the editor used to inspect agent changes.
# What/why: Install the selected Windows package so the required tool is available to later labs.
winget install --id Docker.DockerDesktop --exact        # Install the local container engine used for database/API labs.
# What/why: Install the selected Windows package so the required tool is available to later labs.
winget install --id GitHub.cli --exact                  # Install gh for authenticated repository and pull-request work.
```

`winget` is available because Microsoft App Installer supplies it; updating App Installer fixes the common “command not found” failure. The exact IDs prevent a similarly named package from being selected.

```powershell
# What/why: Create, copy, or configure a real local file/path used by the tool.
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned -Force # Permit local scripts while requiring signatures for downloaded scripts.
# What/why: Use PowerShell to download or call the service with explicit error behavior.
irm get.scoop.sh | iex                                  # Download Scoop's installer and execute it in the current PowerShell process.
# What/why: Execute this lab step; the surrounding explanation defines its expected result and reason for inclusion.
scoop bucket add extras                                 # Add Scoop's community bucket for additional developer packages.
# What/why: Install the developer tool through Scoop without requiring machine-wide installation.
scoop install git nodejs-lts python vscode docker gh     # Install the same tool categories without administrator access.
```

`RemoteSigned` is scoped to the current user so the lesson does not weaken the whole machine. Review a downloaded installer before executing it; the command is convenient, not a substitute for source verification.

```bash
# What/why: Execute this lab step; the surrounding explanation defines its expected result and reason for inclusion.
xcode-select --install                                  # Install Apple's compiler tools required by Homebrew and native packages.
# What/why: Install the required developer tool through Homebrew on macOS.
brew install node python git jq gh                      # Install the runtime, language, version control, JSON, and GitHub tools.
# What/why: Install the required developer tool through Homebrew on macOS.
brew install --cask visual-studio-code docker            # Install GUI applications through Homebrew Cask.
# What/why: Refresh Linux package metadata so installation uses current package indexes.
sudo apt-get update                                     # Refresh Debian package indexes before installation.
# What/why: Install the runtime or system dependency required by the next lab step.
sudo apt-get install --yes ca-certificates curl git build-essential python3 python3-venv python3-pip jq # Install TLS, download, build, Python, and JSON prerequisites.
# What/why: Fetch the requested HTTPS resource or exercise the HTTP endpoint while failing visibly on errors.
curl --proto '=https' --tlsv1.2 --fail --silent --show-error https://deb.nodesource.com/setup_22.x | sudo -E bash - # Add the Node 22 repository using verified TLS.
# What/why: Install the runtime or system dependency required by the next lab step.
sudo apt-get install --yes nodejs                       # Install Node.js from the configured repository.
# What/why: Execute this lab step; the surrounding explanation defines its expected result and reason for inclusion.
sudo snap install code --classic                        # Install VS Code from Snap with its required confinement allowance.
```

The macOS commands install prerequisites before Homebrew packages. The Linux commands refresh metadata, install build tools, add a pinned Node major version, then install the editor; the order prevents missing compiler or package-index errors.

```powershell
# What/why: Run the project tool through the configured package-manager/runtime workflow.
corepack enable                                          # Create package-manager shims managed by the installed Node runtime.
# What/why: Run the project tool through the configured package-manager/runtime workflow.
corepack prepare pnpm@10.6.2 --activate                 # Activate the exact pnpm version expected by the lockfile.
# What/why: Create, copy, or configure a real local file/path used by the tool.
New-Item -ItemType Directory -Force "$HOME\src\launchpad-hub" | Out-Null # Create the learner workspace idempotently.
# What/why: Create, copy, or configure a real local file/path used by the tool.
Set-Location "$HOME\src\launchpad-hub"                  # Make the new workspace the current directory.
```

```bash
# What/why: Run the project tool through the configured package-manager/runtime workflow.
corepack enable                                          # Make pnpm available through Node's package-manager shim.
# What/why: Run the project tool through the configured package-manager/runtime workflow.
corepack prepare pnpm@10.6.2 --activate                 # Pin pnpm so installs reproduce across machines.
# What/why: Inspect or prepare the local machine so the next operation has a known path and state.
mkdir -p "$HOME/src/launchpad-hub"                      # Create the workspace and its parents if necessary.
# What/why: Inspect or prepare the local machine so the next operation has a known path and state.
cd "$HOME/src/launchpad-hub"                             # Enter the workspace for subsequent commands.
```

`--force` on `New-Item`/`-Force` and `mkdir -p` make rerunning the lab safe. The pinned pnpm version prevents lockfile churn.

```powershell
# What/why: Set the Git behavior needed for reproducible collaboration and agent review.
git config --global init.defaultBranch main              # Make new repositories start on the protected branch name.
# What/why: Set the Git behavior needed for reproducible collaboration and agent review.
git config --global pull.rebase true                     # Replay local commits instead of creating accidental merge commits.
# What/why: Create, copy, or configure a real local file/path used by the tool.
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned -Force # Allow this user's local PowerShell automation.
```

```bash
# What/why: Set the Git behavior needed for reproducible collaboration and agent review.
git config --global init.defaultBranch main              # Standardize the initial branch name.
# What/why: Set the Git behavior needed for reproducible collaboration and agent review.
git config --global pull.rebase true                     # Keep pulls linear and easier for agent review.
```

```bash
# What/why: Copy the cumulative course repository and its history onto this computer.
git clone https://github.com/STEVOHCODER/ai-native-software-masterclass.git # Copy the cumulative course repository and history.
# What/why: Inspect or prepare the local machine so the next operation has a known path and state.
cd ai-native-software-masterclass                       # Enter the cloned project.
# What/why: Install project dependencies using the selected package manager and its lockfile policy.
pnpm install --frozen-lockfile                            # Reproduce the exact dependency graph without editing the lockfile.
```

```powershell
# What/why: Execute this lab step; the surrounding explanation defines its expected result and reason for inclusion.
.\chapter-01-local-sandbox-wiring\environment-setup.ps1 -Json # Run the Windows audit and emit machine-readable results.
```

```bash
# What/why: Run a Node.js script or diagnostic using the project runtime.
node --version                                           # Prove the JavaScript runtime is on PATH.
# What/why: Run Python for an isolated utility, configuration check, or environment verification.
python3 --version                                        # Prove Python is available for utilities and scripts.
# What/why: Inspect or change version-controlled project state in an auditable way.
git --version                                            # Prove source control is installed.
# What/why: Inspect or operate the local container runtime used by the course.
docker version                                           # Prove the Docker client can reach its daemon.
# What/why: Use the authenticated GitHub CLI for repository, pull-request, or release operations.
gh --version                                             # Prove GitHub CLI is available for later agent workflows.
```

```bash
# What/why: Run the project tool through the configured package-manager/runtime workflow.
pnpm run validate:environment                            # Execute the repository's cross-platform prerequisite check.
# What/why: Inspect or change version-controlled project state in an auditable way.
git diff --exit-code                                     # Prove setup did not modify tracked project files.
# What/why: Run Python for an isolated utility, configuration check, or environment verification.
python3 -m venv .venv-lab                                # Create an isolated Python environment for the lab.
```

The verification commands turn installation into evidence. `git diff --exit-code` is especially important: a setup process should not silently rewrite course code.

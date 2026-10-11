# Practical Lab 04 — Recover From an Unsafe Agent Change

## Starting point

Complete Lab 03 with a clean branch:

```bash
# What/why: Inspect or change version-controlled project state in an auditable way.
git status --short
```

## Installation

```powershell
# What/why: Install the selected Windows package so the required tool is available to later labs.
winget install --id GitHub.cli
# What/why: Use the authenticated GitHub CLI for repository, pull-request, or release operations.
gh auth login
# What/why: Use the authenticated GitHub CLI for repository, pull-request, or release operations.
gh auth status
```

```bash
# What/why: Install the required developer tool through Homebrew on macOS.
brew install gh
# What/why: Use the authenticated GitHub CLI for repository, pull-request, or release operations.
gh auth login
# What/why: Use the authenticated GitHub CLI for repository, pull-request, or release operations.
gh auth status
```

## Configuration

```bash
# What/why: Create or select an isolated branch so experimental work does not modify the shared branch.
git switch -c lab/recovery-drill
# What/why: Set the Git behavior needed for reproducible collaboration and agent review.
git config --local pull.rebase true
```

Create a harmless bad change:

```bash
# What/why: Send one deterministic protocol request to the process so its response can be verified.
printf '\nunsafe agent mutation\n' >> chapter-12-capstone-monetization-launch/README.md
# What/why: Inspect or change version-controlled project state in an auditable way.
git add .
# What/why: Inspect or change version-controlled project state in an auditable way.
git commit -m "test: simulate unsafe agent mutation"
```

Windows:

```powershell
# What/why: Execute this lab step; the surrounding explanation defines its expected result and reason for inclusion.
Add-Content .\chapter-12-capstone-monetization-launch\README.md "`nunsafe agent mutation"
# What/why: Inspect or change version-controlled project state in an auditable way.
git add .
# What/why: Inspect or change version-controlled project state in an auditable way.
git commit -m "test: simulate unsafe agent mutation"
```

## Execution

Identify and revert the change:

```bash
# What/why: Inspect or change version-controlled project state in an auditable way.
git show --stat --oneline HEAD
# What/why: Inspect or change version-controlled project state in an auditable way.
git revert --no-edit HEAD
# What/why: Inspect or change version-controlled project state in an auditable way.
git diff --check
```

Run the checkpoint watcher once on a separate harmless change:

```bash
# What/why: Run a Node.js script or diagnostic using the project runtime.
node chapter-04-git-version-control-safety/agent-safety-commit.js --once
```

Create a pull request without merging:

```bash
# What/why: Use the authenticated GitHub CLI for repository, pull-request, or release operations.
gh pr create --base main --head lab/recovery-drill --title "lab: recovery drill" --body "Demonstrates agent change inspection and rollback."
```

## Expected result

The unsafe line is absent after the revert, the branch history records both the bad change and the corrective revert, and GitHub shows a reviewable pull request.

## Verification

```bash
# What/why: Inspect or change version-controlled project state in an auditable way.
git grep -n "unsafe agent mutation" || exit 0
# What/why: Inspect or change version-controlled project state in an auditable way.
git log --oneline --max-count=4
# What/why: Use the authenticated GitHub CLI for repository, pull-request, or release operations.
gh pr view --json url,state
```

## Troubleshooting

If `gh auth` is unavailable, use the GitHub web interface for the pull request. If the branch contains unrelated changes, stop and create a fresh branch instead of using `reset --hard`.

## Completion criteria

The learner can identify an agent mutation, explain its diff, revert it without losing unrelated work, and open a reviewable branch.

## Command annotations: what and why

```powershell
# What/why: Install the selected Windows package so the required tool is available to later labs.
winget install --id GitHub.cli                         # Install the GitHub CLI using its exact package ID.
# What/why: Use the authenticated GitHub CLI for repository, pull-request, or release operations.
gh auth login                                           # Start the interactive browser/device authentication flow.
# What/why: Use the authenticated GitHub CLI for repository, pull-request, or release operations.
gh auth status                                          # Prove which account and token context the shell is using.
```

```bash
# What/why: Install the required developer tool through Homebrew on macOS.
brew install gh                                         # Install GitHub CLI through Homebrew.
# What/why: Use the authenticated GitHub CLI for repository, pull-request, or release operations.
gh auth login                                           # Authenticate GitHub CLI without placing a token in source files.
# What/why: Use the authenticated GitHub CLI for repository, pull-request, or release operations.
gh auth status                                          # Display the active account and scopes for review.
```

```bash
# What/why: Create or select an isolated branch so experimental work does not modify the shared branch.
git switch -c lab/recovery-drill                        # Create a disposable branch for the recovery exercise.
# What/why: Set the Git behavior needed for reproducible collaboration and agent review.
git config --local pull.rebase true                      # Keep this repository's pull behavior linear.
# What/why: Send one deterministic protocol request to the process so its response can be verified.
printf '\nunsafe agent mutation\n' >> chapter-12-capstone-monetization-launch/README.md # Simulate one visible bad edit.
# What/why: Inspect or change version-controlled project state in an auditable way.
git add .                                                # Stage the simulated mutation for inspection.
# What/why: Inspect or change version-controlled project state in an auditable way.
git commit -m "test: simulate unsafe agent mutation"     # Record the bad state so recovery is observable.
# What/why: Inspect or change version-controlled project state in an auditable way.
git show --stat --oneline HEAD                            # Inspect the commit summary before undoing it.
# What/why: Inspect or change version-controlled project state in an auditable way.
git revert --no-edit HEAD                                 # Create a safe compensating commit without rewriting history.
# What/why: Inspect or change version-controlled project state in an auditable way.
git diff --check                                          # Confirm the recovery introduced no whitespace defects.
# What/why: Run a Node.js script or diagnostic using the project runtime.
node chapter-04-git-version-control-safety/agent-safety-commit.js --once # Run the checkpoint tool once and inspect its commit.
# What/why: Use the authenticated GitHub CLI for repository, pull-request, or release operations.
gh pr create --base main --head lab/recovery-drill --title "lab: recovery drill" --body "Demonstrates agent change inspection and rollback." # Open a human review boundary.
# What/why: Use the authenticated GitHub CLI for repository, pull-request, or release operations.
gh pr view --json url,state                               # Verify the pull request exists and inspect its state.
```

The exercise intentionally uses `revert`, not `reset --hard`, because a published agent change must remain auditable. The pull request command proves recovery can end in normal review.

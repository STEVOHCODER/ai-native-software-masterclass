# Practical Lab 04 — Recover From an Unsafe Agent Change

## Starting point

Complete Lab 03 with a clean branch:

```bash
git status --short
```

## Installation

```powershell
winget install --id GitHub.cli
gh auth login
gh auth status
```

```bash
brew install gh
gh auth login
gh auth status
```

## Configuration

```bash
git switch -c lab/recovery-drill
git config --local pull.rebase true
```

Create a harmless bad change:

```bash
printf '\nunsafe agent mutation\n' >> chapter-12-capstone-monetization-launch/README.md
git add .
git commit -m "test: simulate unsafe agent mutation"
```

Windows:

```powershell
Add-Content .\chapter-12-capstone-monetization-launch\README.md "`nunsafe agent mutation"
git add .
git commit -m "test: simulate unsafe agent mutation"
```

## Execution

Identify and revert the change:

```bash
git show --stat --oneline HEAD
git revert --no-edit HEAD
git diff --check
```

Run the checkpoint watcher once on a separate harmless change:

```bash
node chapter-04-git-version-control-safety/agent-safety-commit.js --once
```

Create a pull request without merging:

```bash
gh pr create --base main --head lab/recovery-drill --title "lab: recovery drill" --body "Demonstrates agent change inspection and rollback."
```

## Expected result

The unsafe line is absent after the revert, the branch history records both the bad change and the corrective revert, and GitHub shows a reviewable pull request.

## Verification

```bash
git grep -n "unsafe agent mutation" || exit 0
git log --oneline --max-count=4
gh pr view --json url,state
```

## Troubleshooting

If `gh auth` is unavailable, use the GitHub web interface for the pull request. If the branch contains unrelated changes, stop and create a fresh branch instead of using `reset --hard`.

## Completion criteria

The learner can identify an agent mutation, explain its diff, revert it without losing unrelated work, and open a reviewable branch.

## Command annotations: what and why

```powershell
winget install --id GitHub.cli                         # Install the GitHub CLI using its exact package ID.
gh auth login                                           # Start the interactive browser/device authentication flow.
gh auth status                                          # Prove which account and token context the shell is using.
```

```bash
brew install gh                                         # Install GitHub CLI through Homebrew.
gh auth login                                           # Authenticate GitHub CLI without placing a token in source files.
gh auth status                                          # Display the active account and scopes for review.
```

```bash
git switch -c lab/recovery-drill                        # Create a disposable branch for the recovery exercise.
git config --local pull.rebase true                      # Keep this repository's pull behavior linear.
printf '\nunsafe agent mutation\n' >> chapter-12-capstone-monetization-launch/README.md # Simulate one visible bad edit.
git add .                                                # Stage the simulated mutation for inspection.
git commit -m "test: simulate unsafe agent mutation"     # Record the bad state so recovery is observable.
git show --stat --oneline HEAD                            # Inspect the commit summary before undoing it.
git revert --no-edit HEAD                                 # Create a safe compensating commit without rewriting history.
git diff --check                                          # Confirm the recovery introduced no whitespace defects.
node chapter-04-git-version-control-safety/agent-safety-commit.js --once # Run the checkpoint tool once and inspect its commit.
gh pr create --base main --head lab/recovery-drill --title "lab: recovery drill" --body "Demonstrates agent change inspection and rollback." # Open a human review boundary.
gh pr view --json url,state                               # Verify the pull request exists and inspect its state.
```

The exercise intentionally uses `revert`, not `reset --hard`, because a published agent change must remain auditable. The pull request command proves recovery can end in normal review.

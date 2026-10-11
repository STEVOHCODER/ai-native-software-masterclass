# Chapter 04 — Git Version-Control Safety

## Outcome

You will protect source history while allowing fast AI-assisted iteration. The lesson covers branch isolation, conventional commits, secret scanning, merge queues, checkpoint commits, rollback, and the difference between a local safety checkpoint and a reviewable product commit.

## 1. One-time repository setup

```bash
# What/why: Set the Git behavior needed for reproducible collaboration and agent review.
git config --global init.defaultBranch main
# What/why: Set the Git behavior needed for reproducible collaboration and agent review.
git config --global pull.rebase true
# What/why: Set the Git behavior needed for reproducible collaboration and agent review.
git config --global fetch.prune true
# What/why: Set the Git behavior needed for reproducible collaboration and agent review.
git config --global rerere.enabled true
# What/why: Set the Git behavior needed for reproducible collaboration and agent review.
git config --global commit.gpgsign true
# What/why: Set the Git behavior needed for reproducible collaboration and agent review.
git config --global user.name "Your Name"
# What/why: Set the Git behavior needed for reproducible collaboration and agent review.
git config --global user.email "you@example.com"
```

If signing is unavailable on a training machine, document the exception and enforce signing in the protected remote branch instead.

## 2. Branch workflow

```bash
# What/why: Create or select an isolated branch so experimental work does not modify the shared branch.
git switch main
# What/why: Inspect or change version-controlled project state in an auditable way.
git pull --ff-only
# What/why: Create or select an isolated branch so experimental work does not modify the shared branch.
git switch -c feat/lesson-progress-api
# What/why: Inspect or change version-controlled project state in an auditable way.
git status --short
# What/why: Inspect or change version-controlled project state in an auditable way.
git diff --check
```

Commit small, coherent slices:

```bash
# What/why: Inspect or change version-controlled project state in an auditable way.
git add chapter-08-backend-pipelines-concurrency/server.js
# What/why: Inspect or change version-controlled project state in an auditable way.
git commit -m "feat: reject stale progress updates"
# What/why: Inspect or change version-controlled project state in an auditable way.
git show --stat --oneline HEAD
```

Never use `git push --force` on shared branches. To recover a bad local commit, use a new corrective commit or `git revert <sha>`.

## 3. Agent checkpoint watcher

`agent-safety-commit.js` is a local guardrail, not a replacement for code review. Run it once in an agent hook or continuously during a risky refactor:

```bash
# What/why: Run a Node.js script or diagnostic using the project runtime.
node chapter-04-git-version-control-safety/agent-safety-commit.js --once
# What/why: Run a Node.js script or diagnostic using the project runtime.
node chapter-04-git-version-control-safety/agent-safety-commit.js
```

The watcher refuses obvious secret extensions, excludes generated directories, prints diagnostic metadata, and never stages files outside the repository. Review each checkpoint before pushing.

## 4. CI merge gates

Require these checks on `main`:

```bash
# What/why: Install project dependencies using the selected package manager and its lockfile policy.
pnpm install --frozen-lockfile
# What/why: Run the project tool through the configured package-manager/runtime workflow.
pnpm run lint
# What/why: Run the project tool through the configured package-manager/runtime workflow.
pnpm run typecheck
# What/why: Run the project tool through the configured package-manager/runtime workflow.
pnpm run test
# What/why: Run the project tool through the configured package-manager/runtime workflow.
pnpm run security:audit
```

Protect `main`, require one human approval, require conversations to be resolved, and disable direct pushes. Add CODEOWNERS for infrastructure, database, and security files.

## 5. Recovery lab

```bash
# What/why: Inspect or change version-controlled project state in an auditable way.
git log --oneline --decorate --graph -12
# What/why: Inspect or change version-controlled project state in an auditable way.
git reflog -12
# What/why: Inspect or change version-controlled project state in an auditable way.
git revert <bad-commit-sha>
# What/why: Inspect or change version-controlled project state in an auditable way.
git diff HEAD~1..HEAD
```

The learner passes when a bad AI mutation can be identified, reverted, and explained without losing unrelated work.

## Learn by executing

Run [`LAB.md`](LAB.md) for the recovery drill. Every Git/GitHub command is annotated with its effect and reason, with additional source explanation in [`EXPLAINED.md`](EXPLAINED.md).

## 6. GitHub CLI and agent authentication

Install GitHub CLI:

```powershell
# What/why: Install the selected Windows package so the required tool is available to later labs.
winget install --id GitHub.cli
```

```bash
# What/why: Install the required developer tool through Homebrew on macOS.
brew install gh
```

Authenticate interactively and verify the active account:

```bash
# What/why: Use the authenticated GitHub CLI for repository, pull-request, or release operations.
gh auth login
# What/why: Use the authenticated GitHub CLI for repository, pull-request, or release operations.
gh auth status
# What/why: Use the authenticated GitHub CLI for repository, pull-request, or release operations.
gh repo view --json name,url,defaultBranchRef
```

Use `gh auth setup-git` to configure HTTPS Git credentials. For agents, prefer a fine-grained token with repository-specific, read-only permissions. Store CI tokens as repository or environment secrets, never in `.gitconfig`, `.env`, or agent prompts.

## 7. Remote branch protections

```bash
# What/why: Use the authenticated GitHub CLI for repository, pull-request, or release operations.
gh api --method PUT repos/OWNER/REPO/branches/main/protection \
  -f required_status_checks='{"strict":true,"contexts":["verify"]}' \
  -F enforce_admins=true -F required_linear_history=true \
  -F allow_force_pushes=false -F allow_deletions=false
```

Review the generated policy in GitHub before applying it to a shared repository. An agent can open a pull request with `gh pr create`, but a human owns merge approval.

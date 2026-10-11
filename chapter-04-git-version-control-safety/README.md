# Chapter 04 — Git Version-Control Safety

## Outcome

You will protect source history while allowing fast AI-assisted iteration. The lesson covers branch isolation, conventional commits, secret scanning, merge queues, checkpoint commits, rollback, and the difference between a local safety checkpoint and a reviewable product commit.

## 1. One-time repository setup

These commands set the Git behavior needed for reproducible collaboration and agent review.

```bash
git config --global init.defaultBranch main
git config --global pull.rebase true
git config --global fetch.prune true
git config --global rerere.enabled true
git config --global commit.gpgsign true
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
```

If signing is unavailable on a training machine, document the exception and enforce signing in the protected remote branch instead.

## 2. Branch workflow

These commands create or select an isolated branch so experimental work does not modify the shared branch. They also inspect or change version-controlled project state in an auditable way.

```bash
git switch main
git pull --ff-only
git switch -c feat/lesson-progress-api
git status --short
git diff --check
```

Commit small, coherent slices:

These commands inspect or change version-controlled project state in an auditable way.

```bash
git add chapter-08-backend-pipelines-concurrency/server.js
git commit -m "feat: reject stale progress updates"
git show --stat --oneline HEAD
```

Never use `git push --force` on shared branches. To recover a bad local commit, use a new corrective commit or `git revert <sha>`.

## 3. Agent checkpoint watcher

`agent-safety-commit.js` is a local guardrail, not a replacement for code review. Run it once in an agent hook or continuously during a risky refactor:

These commands run a Node.js script or diagnostic using the project runtime.

```bash
node chapter-04-git-version-control-safety/agent-safety-commit.js --once
node chapter-04-git-version-control-safety/agent-safety-commit.js
```

The watcher refuses obvious secret extensions, excludes generated directories, prints diagnostic metadata, and never stages files outside the repository. Review each checkpoint before pushing.

## 4. CI merge gates

Require these checks on `main`:

These commands install project dependencies using the selected package manager and its lockfile policy. They also run the project tool through the configured package-manager/runtime workflow.

```bash
pnpm install --frozen-lockfile
pnpm run lint
pnpm run typecheck
pnpm run test
pnpm run security:audit
```

Protect `main`, require one human approval, require conversations to be resolved, and disable direct pushes. Add CODEOWNERS for infrastructure, database, and security files.

## 5. Recovery lab

These commands inspect or change version-controlled project state in an auditable way.

```bash
git log --oneline --decorate --graph -12
git reflog -12
git revert <bad-commit-sha>
git diff HEAD~1..HEAD
```

The learner passes when a bad AI mutation can be identified, reverted, and explained without losing unrelated work.

## Learn by executing

Run [`LAB.md`](LAB.md) for the recovery drill. Every Git/GitHub command is annotated with its effect and reason, with additional source explanation in [`EXPLAINED.md`](EXPLAINED.md).

## 6. GitHub CLI and agent authentication

Install GitHub CLI:

These commands install the selected Windows package so the required tool is available to later labs.

```powershell
winget install --id GitHub.cli
```

These commands install the required developer tool through Homebrew on macOS.

```bash
brew install gh
```

Authenticate interactively and verify the active account:

These commands use the authenticated GitHub CLI for repository, pull-request, or release operations.

```bash
gh auth login
gh auth status
gh repo view --json name,url,defaultBranchRef
```

Use `gh auth setup-git` to configure HTTPS Git credentials. For agents, prefer a fine-grained token with repository-specific, read-only permissions. Store CI tokens as repository or environment secrets, never in `.gitconfig`, `.env`, or agent prompts.

## 7. Remote branch protections

These commands use the authenticated GitHub CLI for repository, pull-request, or release operations.

```bash
gh api --method PUT repos/OWNER/REPO/branches/main/protection \
  -f required_status_checks='{"strict":true,"contexts":["verify"]}' \
  -F enforce_admins=true -F required_linear_history=true \
  -F allow_force_pushes=false -F allow_deletions=false
```

Review the generated policy in GitHub before applying it to a shared repository. An agent can open a pull request with `gh pr create`, but a human owns merge approval.

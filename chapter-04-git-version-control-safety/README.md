# Chapter 04 — Git Version-Control Safety

## Outcome

You will protect source history while allowing fast AI-assisted iteration. The lesson covers branch isolation, conventional commits, secret scanning, merge queues, checkpoint commits, rollback, and the difference between a local safety checkpoint and a reviewable product commit.

## 1. One-time repository setup

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

```bash
git switch main
git pull --ff-only
git switch -c feat/lesson-progress-api
git status --short
git diff --check
```

Commit small, coherent slices:

```bash
git add chapter-08-backend-pipelines-concurrency/server.js
git commit -m "feat: reject stale progress updates"
git show --stat --oneline HEAD
```

Never use `git push --force` on shared branches. To recover a bad local commit, use a new corrective commit or `git revert <sha>`.

## 3. Agent checkpoint watcher

`agent-safety-commit.js` is a local guardrail, not a replacement for code review. Run it once in an agent hook or continuously during a risky refactor:

```bash
node chapter-04-git-version-control-safety/agent-safety-commit.js --once
node chapter-04-git-version-control-safety/agent-safety-commit.js
```

The watcher refuses obvious secret extensions, excludes generated directories, prints diagnostic metadata, and never stages files outside the repository. Review each checkpoint before pushing.

## 4. CI merge gates

Require these checks on `main`:

```bash
pnpm install --frozen-lockfile
pnpm run lint
pnpm run typecheck
pnpm run test
pnpm run security:audit
```

Protect `main`, require one human approval, require conversations to be resolved, and disable direct pushes. Add CODEOWNERS for infrastructure, database, and security files.

## 5. Recovery lab

```bash
git log --oneline --decorate --graph -12
git reflog -12
git revert <bad-commit-sha>
git diff HEAD~1..HEAD
```

The learner passes when a bad AI mutation can be identified, reverted, and explained without losing unrelated work.

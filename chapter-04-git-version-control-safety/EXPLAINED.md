# Chapter 04 Git Safety Walkthrough

`git switch -c` creates an isolated branch so an agent cannot alter the shared branch directly. `git config --local` keeps lesson-specific behavior in the repository. `Add-Content` and `printf` create a deliberately harmless mutation. `git add` stages the exact change; `git commit` records it; `git show` reveals what was recorded; `git revert --no-edit` creates a compensating commit without rewriting history; `git diff --check` catches whitespace defects. `gh pr create` opens a review boundary, and `gh pr view` proves the remote object exists.

The checkpoint watcher uses `execFileSync` rather than a shell string, filters generated and secret-like paths, stages only changed files, and records an ISO timestamp. It is a rollback aid, not an approval system.

## Completion proof

The learner can deliberately create, inspect, revert, and review an agent mutation while preserving all other branch history.


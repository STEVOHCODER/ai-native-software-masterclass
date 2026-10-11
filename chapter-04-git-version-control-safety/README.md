# Chapter 04: Git Version Control Safety

Use short-lived branches, protected `main`, mandatory CI, and human review for security-sensitive changes. Agents may create checkpoint commits, but they must never force-push, rewrite history, or commit secrets.

Recommended workflow:

```bash
git switch -c feat/<bounded-change>
git diff --check
git add --all
git commit -m "feat: describe the bounded change"
git push --set-upstream origin HEAD
```

Configure protected branches to require passing tests, at least one review, and resolved conversations. The watcher below commits only changed files inside the repository and excludes `.git`, dependency directories, and secret-like filenames.


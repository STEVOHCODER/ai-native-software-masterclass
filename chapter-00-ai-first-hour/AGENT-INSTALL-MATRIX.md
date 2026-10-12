# Agent Install Matrix

Three agents are taught in this course. Install at least one before continuing; the audit in `LAB.md` reports the state of all three.

| Agent | Install | Authenticate | Verify |
|---|---|---|---|
| `claude` | `npm install -g @anthropic-ai/claude-code` | `claude login` or set `ANTHROPIC_API_KEY` | `claude --version` |
| `opencode` | `npm install -g opencode-ai` | Run `opencode` and complete the provider sign-in | `opencode --version` |
| `codex` | `npm install -g @openai/codex` | `codex login` or set `OPENAI_API_KEY` | `codex --version` |

## Global install flags worth knowing

| Flag | Effect | When it matters |
|---|---|---|
| `-g` | Installs into the global prefix so the command is on `PATH`. | Required for any of the three agents. |
| `--version` | Prints the version and exits. | The verification probe used by `agent-clis.js`. |
| `-y` | Skips the npm confirmation prompt. | Useful in scripted workstation provisioning. |

## Provider keys used by this course

| Variable | Purpose | Notes |
|---|---|---|
| `ANTHROPIC_API_KEY` | Authenticates direct Anthropic model calls in `ai-request.js`. | Read from the environment, never hardcoded. |
| `OPENAI_API_KEY` | Authenticates direct OpenAI model calls in `ai-request.js`. | Used automatically when the Anthropic key is absent. |

## If a global install cannot write to the global prefix

On managed Windows machines the npm global prefix may require elevation. Use a version manager instead of running the install as administrator:

```bash
npm config get prefix
```

If the reported path is under `Program Files`, install Node through a version manager such as nvm or fnm so the prefix lives in your user profile. Installing global packages as administrator is what creates permission mismatches later.

## Verification without installing everything

A learner may install only one agent and still complete the chapter. `auditAgents()` reports the remaining agents as missing with their install commands, so the gap is visible and resumable rather than silently ignored.
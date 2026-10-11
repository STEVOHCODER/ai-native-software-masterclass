# Practical Lab 02 — Configure and Exercise an AI Provider Gateway

## Starting point

Complete Lab 01. Choose one provider with an account and development API key. A key is optional for the offline validation portion and required only for the live request.

## Installation


Run these commands to install or execute the project tooling, then verify that the local implementation produces the expected result.

```bash
pnpm install --frozen-lockfile
pnpm add @anthropic-ai/sdk openai @google/generative-ai
pnpm add --save-dev tsx
```

Do not commit the resulting `.env` file.

## Configuration


Run these commands to complete the cp step and verify its result before continuing.

```bash
cp .env.example .env
```

Windows:


Run these commands to complete the Copy-Item step and verify its result before continuing.

```powershell
Copy-Item .env.example .env
notepad .env
```

Set exactly one provider key and a provider-neutral routing file:

```toml
# chapter-02-api-infrastructure-gateways/openai-compatible.config.toml
default_provider = "openai"
timeout_ms = 30000
max_attempts = 2

[providers.openai]
base_url = "https://api.openai.com/v1"
api_key_env = "OPENAI_API_KEY"
model = "gpt-4.1-mini"
```

For OpenRouter, set `OPENROUTER_API_KEY`; for DeepInfra use `DEEPINFRA_API_KEY`; for Together use `TOGETHER_API_KEY`. The gateway source maps each provider to its own endpoint and response shape.

## Execution

First prove missing credentials fail safely:


Run these commands to install or execute the project tooling, then verify that the local implementation produces the expected result.

```bash
env -u OPENAI_API_KEY pnpm exec tsx -e "import { complete } from './chapter-02-api-infrastructure-gateways/api-client.ts'; complete({provider:'openai',model:'gpt-4.1-mini',messages:[{role:'user',content:'hello'}]}).catch(e => console.log(e.message))"
```

PowerShell:


Run these commands to install or execute the project tooling, then verify that the local implementation produces the expected result.

```powershell
$env:OPENAI_API_KEY = $null
pnpm exec tsx -e "import { complete } from './chapter-02-api-infrastructure-gateways/api-client.ts'; complete({provider:'openai',model:'gpt-4.1-mini',messages:[{role:'user',content:'hello'}]}).catch(e => console.log(e.message))"
```

Then run a live request only if the key is configured:


Run these commands to install or execute the project tooling, then verify that the local implementation produces the expected result.

```bash
pnpm exec tsx -e "import { complete } from './chapter-02-api-infrastructure-gateways/api-client.ts'; complete({provider:'openai',model:'gpt-4.1-mini',messages:[{role:'user',content:'Return exactly the word READY'}]},{maxAttempts:1}).then(r => console.log(r.text)).catch(e => { console.error(e.message); process.exit(1) })"
```

## Expected result

Without a key, the command reports `Missing OPENAI_API_KEY` and makes no network request. With a valid key, the live command prints the provider response and no authorization value.

## Verification


Run these commands to install or execute the project tooling, then verify that the local implementation produces the expected result.

```bash
pnpm run typecheck
pnpm run lint
```

Inspect the request with a local mock before using money:


Run these commands to install or execute the project tooling, then verify that the local implementation produces the expected result.

```bash
node --input-type=module -e "const u=new URL('https://api.openai.com/v1/chat/completions'); console.log(u.origin+u.pathname)"
```

## Troubleshooting

| Symptom | Fix |
|---|---|
| `401` | Check provider key, account, and endpoint; do not retry authentication errors |
| `404 model` | Copy the exact model identifier from the provider dashboard |
| `429` | Lower request frequency, set a spend limit, and let bounded retry handle transient throttling |
| empty text | Inspect the provider response adapter; do not return a success-shaped empty response |
| key appears in Git | Revoke it immediately, remove `.env` from history, and rotate the credential |

## Completion criteria

The learner can switch provider by changing the typed request and environment variable, can demonstrate safe missing-key behavior, and can show a passing type check without exposing credentials.

## Command annotations: what and why


Run these commands to install or execute the project tooling, then verify that the local implementation produces the expected result.

```bash
pnpm install --frozen-lockfile                            # Install the repository's pinned dependencies without changing the lockfile.
pnpm add @anthropic-ai/sdk openai @google/generative-ai   # Add official provider SDKs when the lesson needs native features.
pnpm add --save-dev tsx                                   # Install the TypeScript execution tool used for short gateway probes.
cp .env.example .env                                      # Create a private local environment file from the safe template.
```


Run these commands to complete the Copy-Item step and verify its result before continuing.

```powershell
Copy-Item .env.example .env                               # Copy the environment template on Windows.
notepad .env                                               # Open the actual project secret file for manual editing.
```

The install commands prepare tooling; the copy commands create the real file the application reads. `.env` is ignored by Git and must contain development keys only.


Run these commands to install or execute the project tooling, then verify that the local implementation produces the expected result.

```bash
env -u OPENAI_API_KEY pnpm exec tsx -e "..."              # Remove one key for this process and prove missing-key validation.
pnpm exec tsx -e "import { complete } from './chapter-02-api-infrastructure-gateways/api-client.ts'; complete({provider:'openai',model:'gpt-4.1-mini',messages:[{role:'user',content:'Return exactly the word READY'}]},{maxAttempts:1}).then(r => console.log(r.text)).catch(e => { console.error(e.message); process.exit(1) })" # Execute one bounded live gateway request.
```


Run these commands to install or execute the project tooling, then verify that the local implementation produces the expected result.

```powershell
$env:OPENAI_API_KEY = $null                               # Remove the key only from the current PowerShell process.
pnpm exec tsx -e "..."                                    # Run the same missing-key check through Windows' shell.
```

The first probe must fail before networking; the second is the paid/external operation and is run only with explicit credentials.


Run these commands to install or execute the project tooling, then verify that the local implementation produces the expected result.

```bash
pnpm run typecheck                                        # Verify provider adapters satisfy strict TypeScript contracts.
pnpm run lint                                             # Detect unsafe or inconsistent JavaScript/TypeScript patterns.
node --input-type=module -e "const u=new URL('https://api.openai.com/v1/chat/completions'); console.log(u.origin+u.pathname)" # Parse and print the intended endpoint before a live call.
```

The verification commands separate compile-time correctness, style/static correctness, and endpoint inspection.

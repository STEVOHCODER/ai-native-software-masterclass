# Chapter 02 — API Infrastructure Gateways

## Outcome

You will build an AI provider boundary that can switch models without changing product code. The gateway covers Anthropic, OpenAI, Google Gemini, OpenRouter, DeepInfra, and Together AI with explicit environment variables, timeouts, retries, response validation, redacted diagnostics, deterministic caching, and provider-specific request shapes.

## 1. Install and configure

```bash
pnpm add @anthropic-ai/sdk openai @google/generative-ai
pnpm add -D tsx typescript
```

Create a local `.env` from the root example and set only the provider keys you actually use:

```bash
cp .env.example .env
```

Windows PowerShell:

```powershell
Copy-Item .env.example .env
notepad .env
```

Never place keys in `continue-config.json`, browser bundles, commits, screenshots, or client-side local storage.

## 2. Provider matrix

| Provider | Key | Native transport | Example model |
|---|---|---|---|
| Anthropic | `ANTHROPIC_API_KEY` | Messages API | `claude-3-5-haiku-latest` |
| OpenAI | `OPENAI_API_KEY` | Responses/Chat API | `gpt-4.1-mini` |
| Gemini | `GEMINI_API_KEY` | `generateContent` | `gemini-2.0-flash` |
| OpenRouter | `OPENROUTER_API_KEY` | OpenAI-compatible | provider-routed model |
| DeepInfra | `DEEPINFRA_API_KEY` | OpenAI-compatible | hosted open model |
| Together | `TOGETHER_API_KEY` | OpenAI-compatible | hosted open model |

Provider adapters belong in the gateway. Routes, React components, tests, and CLI scripts depend only on `complete(request)`. This keeps vendor changes and failover policy out of business logic.

## 3. Request lifecycle

1. Validate provider, model, message roles, token limit, and prompt size.
2. Reject missing credentials before network work.
3. Build a provider-specific request.
4. Apply an abort deadline and bounded retry for transient `408`, `429`, and `5xx` responses.
5. Parse only known response paths.
6. Redact keys and prompt bodies from diagnostics.
7. Cache only explicitly cacheable, deterministic requests with bounded TTL and size.

Do not retry invalid requests, authentication failures, content policy failures, or malformed provider responses.

## 4. Exercise: build a model selector

```bash
pnpm exec tsx -e "import { complete } from './chapter-02-api-infrastructure-gateways/api-client.ts'; complete({provider:'openai',model:'gpt-4.1-mini',messages:[{role:'user',content:'Give one concise product idea'}]}).then(console.log).catch((error) => { console.error(error.message); process.exit(1); })"
```

Test without spending tokens by omitting keys:

```bash
pnpm exec tsx -e "import { complete } from './chapter-02-api-infrastructure-gateways/api-client.ts'; complete({provider:'openai',model:'gpt-4.1-mini',messages:[{role:'user',content:'hello'}]}).catch((error) => console.log(error.message))"
```

## 5. Production checklist

- Separate development, staging, and production keys.
- Set provider spend limits and alert thresholds.
- Record provider, model, latency, status, and request ID; never record secrets or raw private prompts.
- Add a per-tenant budget before exposing AI features.
- Use a queue for long-running generations.
- Verify a fallback model explicitly; “fallback” must not silently change safety or data residency requirements.


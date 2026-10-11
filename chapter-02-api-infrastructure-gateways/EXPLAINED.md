# Chapter 02 Code and Configuration Walkthrough

## TypeScript structure

| Construct | Explanation | Design reason |
|---|---|---|
| `Provider` union | Restricts provider names at compile time. | Prevents arbitrary endpoint selection. |
| `ChatMessage` | Defines allowed roles and text. | Makes provider adapters receive a stable contract. |
| `CompletionRequest` | Carries provider, model, messages, and controls. | Keeps callers independent from vendor payloads. |
| `ProviderConfig` | Stores endpoint, environment key name, body builder, and response reader. | Centralizes vendor differences. |
| `readString` | Walks an unknown response safely and returns only strings. | Prevents unsafe casts on provider responses. |
| `cacheKey` | Serializes request content while ignoring the cache flag. | The same deterministic request can reuse a cached answer. |
| `AbortController` | Cancels a request after the configured deadline. | Prevents hung provider calls from exhausting workers. |
| `isRetryable` | Allows only timeout, throttle, and server failures to retry. | Avoids retrying invalid credentials or bad requests. |
| `complete` | Validates, authenticates, sends, parses, caches, and returns the result. | Provides one safe gateway for every application feature. |

## Configuration file

In `openai-compatible.config.toml`, `default_provider` selects the initial route, `timeout_ms` bounds network work, `max_attempts` limits retries, and each `[providers.*]` table maps a base URL, environment variable, and model. The file intentionally contains no secret. `.env` supplies the secret at runtime; the TypeScript module reads it through `process.env`.

## Live command walkthrough

The `pnpm exec tsx -e` command uses the repository's TypeScript runner, imports the gateway, creates a typed request, awaits the promise, prints only the text, and converts failures into a non-zero process exit. The missing-key command proves validation happens before network activity.

## Completion proof

A learner can change `provider: 'openai'` to another supported provider, update only the environment variable/model, run the same gateway call, and explain why the frontend never needs provider-specific code.


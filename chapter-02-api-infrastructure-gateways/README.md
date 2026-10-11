# Chapter 02: API Infrastructure Gateways

The gateway normalizes six providers behind one typed contract. Keep credentials in environment variables or a secret manager, never in source control.

| Provider | Environment variable | Endpoint |
|---|---|---|
| Anthropic | `ANTHROPIC_API_KEY` | `https://api.anthropic.com/v1/messages` |
| OpenAI | `OPENAI_API_KEY` | `https://api.openai.com/v1/chat/completions` |
| Gemini | `GEMINI_API_KEY` | `https://generativelanguage.googleapis.com/v1beta/models` |
| OpenRouter | `OPENROUTER_API_KEY` | `https://openrouter.ai/api/v1/chat/completions` |
| DeepInfra | `DEEPINFRA_API_KEY` | `https://api.deepinfra.com/v1/openai/chat/completions` |
| Together | `TOGETHER_API_KEY` | `https://api.together.xyz/v1/chat/completions` |

Use a provider-specific model name, redact authorization values in logs, enforce request timeouts, and cache only deterministic public responses. Do not cache prompts containing secrets or personal data. The module below uses an in-memory bounded TTL cache and a single fetch implementation so retry and error behavior stays consistent.


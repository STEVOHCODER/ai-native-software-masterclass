'use strict';

// This module is the first executable proof that the learner can reach a real AI model.
// It is deliberately dependency-free: Node's built-in fetch performs the request, so no SDK is required.

// Providers are listed in precedence order so a machine with two keys uses a predictable one.
const PROVIDERS = [
  {
    name: 'anthropic',
    envKey: 'ANTHROPIC_API_KEY',
    baseUrl: 'https://api.anthropic.com/v1/messages',
    model: 'claude-sonnet-4-5',
    auth: (apiKey) => `Bearer ${apiKey}`, // Both providers used here accept a bearer-style header.
  },
  {
    name: 'openai',
    envKey: 'OPENAI_API_KEY',
    baseUrl: 'https://api.openai.com/v1/chat/completions',
    model: 'gpt-4o-mini',
    auth: (apiKey) => `Bearer ${apiKey}`,
  },
];

/**
 * Chooses a provider from environment variables without throwing when none is configured.
 * A learner without a key must still be able to run the chapter and read the setup instructions.
 */
function resolveProvider(env = process.env) {
  for (const provider of PROVIDERS) {
    const raw = env[provider.envKey];
    const apiKey = typeof raw === 'string' ? raw.trim() : '';
    if (!apiKey) continue; // An exported-but-blank variable is a common shell accident, not a key.
    return { ...provider, envKey: provider.envKey, apiKey };
  }
  return null;
}

/**
 * Builds a provider request. Pure: it performs no network call, so the lesson is inspectable.
 */
function buildRequest({ provider, prompt, maxTokens = 256 }) {
  if (!provider) throw new Error('No AI provider configured. Set ANTHROPIC_API_KEY or OPENAI_API_KEY first.');
  if (typeof prompt !== 'string' || !prompt.trim()) throw new Error('A non-empty prompt is required.');
  const { name } = provider;
  const body = name === 'anthropic'
    ? { model: provider.model, max_tokens: maxTokens, messages: [{ role: 'user', content: prompt }] }
    : { model: provider.model, max_tokens: maxTokens, messages: [{ role: 'user', content: prompt }] };
  return {
    url: provider.baseUrl,
    init: {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: provider.auth(provider.apiKey),
      },
      body: JSON.stringify(body),
    },
  };
}

/**
 * Extracts assistant text from either provider's response shape, returning '' when unknown.
 * A new or unexpected payload must not crash the learner mid-lab.
 */
function parseCompletion(payload) {
  const openaiText = payload?.choices?.[0]?.message?.content;
  if (typeof openaiText === 'string' && openaiText) return openaiText;
  const anthropicText = Array.isArray(payload?.content)
    ? payload.content.filter((block) => block?.type === 'text').map((block) => block.text).join('')
    : '';
  return anthropicText || '';
}

/**
 * Performs the built request. Used by the lab's verification step, not by unit tests,
 * because a real call costs money and requires a network connection.
 */
async function requestCompletion({ provider, prompt, maxTokens = 256, fetchImpl = fetch }) {
  const { url, init } = buildRequest({ provider, prompt, maxTokens });
  const response = await fetchImpl(url, init);
  const payload = await response.json();
  if (!response.ok) throw new Error(`AI request failed (${response.status}): ${payload?.error?.message || 'unknown error'}`);
  return parseCompletion(payload);
}

module.exports = { PROVIDERS, resolveProvider, buildRequest, parseCompletion, requestCompletion };
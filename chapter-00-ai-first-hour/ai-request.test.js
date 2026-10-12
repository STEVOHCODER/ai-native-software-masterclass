'use strict';

const test = require('node:test'); // Use Node's built-in test runner so the course needs no test framework install.
const assert = require('node:assert/strict'); // Use strict equality assertions.
const { resolveProvider, buildRequest, parseCompletion } = require('./ai-request'); // Test the real module, not a copy.

test('resolveProvider returns null when no supported AI key is present', () => { // A learner without a key must still be able to run the lab.
  const provider = resolveProvider({});
  assert.equal(provider, null);
});

test('resolveProvider selects the Anthropic key and applies its default model', () => { // Provider choice must be derived from the environment, not hardcoded by the learner.
  const provider = resolveProvider({ ANTHROPIC_API_KEY: 'sk-ant-test' });
  assert.equal(provider.name, 'anthropic');
  assert.equal(provider.apiKey, 'sk-ant-test');
  assert.match(provider.baseUrl, /anthropic\.com/);
  assert.ok(provider.model.length > 0);
});

test('resolveProvider falls back to the OpenAI key when Anthropic is absent', () => { // Multiple providers can coexist on one machine.
  const provider = resolveProvider({ OPENAI_API_KEY: 'sk-openai-test' });
  assert.equal(provider.name, 'openai');
  assert.match(provider.baseUrl, /openai\.com/);
});

test('resolveProvider ignores an empty key and reports no provider', () => { // An exported-but-blank variable is a common shell accident and must not be treated as a key.
  assert.equal(resolveProvider({ ANTHROPIC_API_KEY: '' }), null);
  assert.equal(resolveProvider({ ANTHROPIC_API_KEY: '   ' }), null);
});

test('buildRequest targets the provider endpoint with JSON headers and a bounded token budget', () => { // The request shape is the core lesson: endpoint, auth header, and a capped cost.
  const provider = resolveProvider({ OPENAI_API_KEY: 'sk-openai-test' });
  const request = buildRequest({ provider, prompt: 'Say hello in one word', maxTokens: 64 });
  assert.match(request.url, /openai\.com/);
  assert.equal(request.init.method, 'POST');
  assert.equal(request.init.headers['content-type'], 'application/json');
  assert.match(String(request.init.headers.authorization), /^Bearer sk-openai-test$/);
  const body = JSON.parse(request.init.body);
  assert.equal(body.max_tokens, 64);
  assert.equal(body.messages[0].role, 'user');
  assert.equal(body.messages[0].content, 'Say hello in one word');
});

test('buildRequest rejects an empty prompt instead of spending a call', () => { // A blank prompt is a learner mistake that should fail loudly before any request is sent.
  const provider = resolveProvider({ OPENAI_API_KEY: 'sk-openai-test' });
  assert.throws(() => buildRequest({ provider, prompt: '   ', maxTokens: 64 }), /prompt/i);
});

test('buildRequest rejects a missing provider so the lab explains the key requirement', () => { // Failing here produces a teaching message instead of an undefined-property crash.
  assert.throws(() => buildRequest({ provider: null, prompt: 'hi', maxTokens: 64 }), /provider/i);
});

test('parseCompletion extracts assistant text from an OpenAI style payload', () => { // Learners must be able to read a real response body.
  const text = parseCompletion({ choices: [{ message: { content: 'Hello' } }] });
  assert.equal(text, 'Hello');
});

test('parseCompletion extracts assistant text from an Anthropic style payload', () => { // The two providers used in this course return different shapes.
  const text = parseCompletion({ content: [{ type: 'text', text: 'Hello' }] });
  assert.equal(text, 'Hello');
});

test('parseCompletion returns an empty string when the payload carries no text', () => { // An unfamiliar response shape must not crash the lab mid-run.
  assert.equal(parseCompletion({ unexpected: true }), '');
  assert.equal(parseCompletion({ content: [] }), '');
});
export type Provider = 'anthropic' | 'openai' | 'gemini' | 'openrouter' | 'deepinfra' | 'together';

export interface ChatMessage {
  readonly role: 'system' | 'user' | 'assistant';
  readonly content: string;
}

export interface CompletionRequest {
  readonly provider: Provider;
  readonly model: string;
  readonly messages: readonly ChatMessage[];
  readonly temperature?: number;
  readonly maxTokens?: number;
  readonly cacheable?: boolean;
}

export interface CompletionResponse {
  readonly provider: Provider;
  readonly model: string;
  readonly text: string;
  readonly requestId: string | null;
  readonly cached: boolean;
}

interface ProviderConfig {
  readonly endpoint: string;
  readonly apiKeyEnvironment: string;
  readonly headers: Record<string, string>;
  readonly buildBody: (request: CompletionRequest) => Record<string, unknown>;
  readonly readText: (payload: unknown) => string;
}

interface CacheEntry {
  readonly expiresAt: number;
  readonly value: CompletionResponse;
}

const CACHE_TTL_MS = 30_000;
const MAX_CACHE_ENTRIES = 128;
const cache = new Map<string, CacheEntry>();

const readString = (value: unknown, path: readonly string[]): string => {
  let current: unknown = value;
  for (const key of path) {
    if (typeof current !== 'object' || current === null || !(key in current)) return '';
    current = (current as Record<string, unknown>)[key];
  }
  return typeof current === 'string' ? current : '';
};

const openAiBody = (request: CompletionRequest): Record<string, unknown> => ({
  model: request.model,
  messages: request.messages,
  temperature: request.temperature ?? 0.2,
  max_tokens: request.maxTokens ?? 1024,
});

const configs: Record<Provider, ProviderConfig> = {
  anthropic: {
    endpoint: 'https://api.anthropic.com/v1/messages',
    apiKeyEnvironment: 'ANTHROPIC_API_KEY',
    headers: { 'anthropic-version': '2023-06-01' },
    buildBody: (r) => ({ model: r.model, max_tokens: r.maxTokens ?? 1024, temperature: r.temperature ?? 0.2, messages: r.messages.filter((m) => m.role !== 'system'), system: r.messages.find((m) => m.role === 'system')?.content }),
    readText: (p) => readString(p, ['content', '0', 'text']),
  },
  openai: { endpoint: 'https://api.openai.com/v1/chat/completions', apiKeyEnvironment: 'OPENAI_API_KEY', headers: {}, buildBody: openAiBody, readText: (p) => readString(p, ['choices', '0', 'message', 'content']) },
  gemini: { endpoint: 'https://generativelanguage.googleapis.com/v1beta/models', apiKeyEnvironment: 'GEMINI_API_KEY', headers: {}, buildBody: (r) => ({ contents: [{ role: 'user', parts: [{ text: r.messages.map((m) => `${m.role}: ${m.content}`).join('\n') }] }], generationConfig: { temperature: r.temperature ?? 0.2, maxOutputTokens: r.maxTokens ?? 1024 } }), readText: (p) => readString(p, ['candidates', '0', 'content', 'parts', '0', 'text']) },
  openrouter: { endpoint: 'https://openrouter.ai/api/v1/chat/completions', apiKeyEnvironment: 'OPENROUTER_API_KEY', headers: { 'HTTP-Referer': 'https://masterclass.local', 'X-Title': 'Masterclass Hub' }, buildBody: openAiBody, readText: (p) => readString(p, ['choices', '0', 'message', 'content']) },
  deepinfra: { endpoint: 'https://api.deepinfra.com/v1/openai/chat/completions', apiKeyEnvironment: 'DEEPINFRA_API_KEY', headers: {}, buildBody: openAiBody, readText: (p) => readString(p, ['choices', '0', 'message', 'content']) },
  together: { endpoint: 'https://api.together.xyz/v1/chat/completions', apiKeyEnvironment: 'TOGETHER_API_KEY', headers: {}, buildBody: openAiBody, readText: (p) => readString(p, ['choices', '0', 'message', 'content']) },
};

const cacheKey = (request: CompletionRequest): string => JSON.stringify({ ...request, cacheable: undefined });

export async function complete(request: CompletionRequest, timeoutMs = 30_000): Promise<CompletionResponse> {
  if (!request.messages.length || request.messages.some((message) => !message.content.trim())) throw new Error('messages must contain non-empty content');
  const config = configs[request.provider];
  const apiKey = process.env[config.apiKeyEnvironment];
  if (!apiKey) throw new Error(`Missing ${config.apiKeyEnvironment}`);
  const key = cacheKey(request);
  const existing = cache.get(key);
  if (request.cacheable && existing && existing.expiresAt > Date.now()) return { ...existing.value, cached: true };
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const endpoint = request.provider === 'gemini' ? `${config.endpoint}/${encodeURIComponent(request.model)}:generateContent?key=${encodeURIComponent(apiKey)}` : config.endpoint;
    const headers = { 'content-type': 'application/json', ...config.headers, ...(request.provider === 'gemini' ? {} : { authorization: `Bearer ${apiKey}` }) };
    const response = await fetch(endpoint, { method: 'POST', headers, body: JSON.stringify(config.buildBody(request)), signal: controller.signal });
    const payload: unknown = await response.json();
    if (!response.ok) throw new Error(`Provider ${request.provider} returned ${response.status}: ${JSON.stringify(payload).slice(0, 500)}`);
    const value: CompletionResponse = { provider: request.provider, model: request.model, text: config.readText(payload), requestId: response.headers.get('x-request-id'), cached: false };
    if (!value.text) throw new Error(`Provider ${request.provider} returned no text`);
    if (request.cacheable) {
      cache.set(key, { expiresAt: Date.now() + CACHE_TTL_MS, value });
      while (cache.size > MAX_CACHE_ENTRIES) cache.delete(cache.keys().next().value as string);
    }
    return value;
  } finally {
    clearTimeout(timer);
  }
}


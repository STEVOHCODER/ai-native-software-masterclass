import { createInterface } from 'node:readline';
import { readFile, readdir } from 'node:fs/promises';
import { resolve, sep } from 'node:path';

interface RpcRequest { readonly jsonrpc: '2.0'; readonly id?: number | string; readonly method: string; readonly params?: Record<string, unknown>; }
interface RpcResponse { readonly jsonrpc: '2.0'; readonly id: number | string | null; readonly result?: unknown; readonly error?: { code: number; message: string }; }
const root = resolve(process.env.MCP_DOCS_ROOT || process.cwd());
const allowed = (candidate: string): string => { const target = resolve(root, candidate); if (target !== root && !target.startsWith(`${root}${sep}`)) throw new Error('Path escapes documentation root'); return target; };
const reply = (response: RpcResponse): void => process.stdout.write(`${JSON.stringify(response)}\n`);

async function handle(request: RpcRequest): Promise<unknown> {
  if (request.method === 'initialize') return { protocolVersion: '2024-11-05', capabilities: { tools: {} }, serverInfo: { name: 'masterclass-hub', version: '1.0.0' } };
  if (request.method === 'tools/list') return { tools: [{ name: 'read_documentation', description: 'Read an allow-listed local documentation file', inputSchema: { type: 'object', properties: { path: { type: 'string' } }, required: ['path'] } }, { name: 'fetch_https', description: 'Fetch a bounded HTTPS resource', inputSchema: { type: 'object', properties: { url: { type: 'string' } }, required: ['url'] } }, { name: 'list_environment', description: 'List safe environment metadata', inputSchema: { type: 'object' } }] };
  if (request.method !== 'tools/call') return {};
  const name = String(request.params?.name || '');
  const args = (request.params?.arguments || {}) as Record<string, unknown>;
  if (name === 'read_documentation') return [{ type: 'text', text: (await readFile(allowed(String(args.path || '')), 'utf8')).slice(0, 100_000) }];
  if (name === 'fetch_https') { const url = new URL(String(args.url || '')); if (url.protocol !== 'https:') throw new Error('Only HTTPS URLs are allowed'); const response = await fetch(url, { signal: AbortSignal.timeout(10_000) }); if (!response.ok) throw new Error(`HTTP ${response.status}`); return [{ type: 'text', text: (await response.text()).slice(0, 50_000) }]; }
  if (name === 'list_environment') return [{ type: 'text', text: JSON.stringify({ platform: process.platform, node: process.version, documentationEntries: await readdir(root) }) }];
  throw new Error(`Unknown tool: ${name}`);
}

createInterface({ input: process.stdin, crlfDelay: Infinity }).on('line', async (line) => {
  try { const request = JSON.parse(line) as RpcRequest; reply({ jsonrpc: '2.0', id: request.id ?? null, result: await handle(request) }); }
  catch (error) { reply({ jsonrpc: '2.0', id: null, error: { code: -32000, message: error instanceof Error ? error.message : 'Request failed' } }); }
});


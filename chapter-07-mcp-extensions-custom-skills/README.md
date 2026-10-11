# Chapter 07 — MCP Extensions and Custom Skills

## Outcome

You will build a narrowly scoped MCP server that gives an AI coding agent safe access to local course documentation, approved HTTPS references, and non-sensitive environment metadata. You will also learn why tool schemas, path boundaries, output limits, and approval UX are security controls.

## 1. Install the MCP development toolchain

```bash
pnpm add @modelcontextprotocol/sdk
pnpm add -D tsx typescript
```

Run the local server with an explicit documentation root:

```powershell
$env:MCP_DOCS_ROOT = (Resolve-Path .).Path
pnpm exec tsx chapter-07-mcp-extensions-custom-skills/mcp-server.ts
```

```bash
MCP_DOCS_ROOT="$PWD" pnpm exec tsx chapter-07-mcp-extensions-custom-skills/mcp-server.ts
```

The process uses line-delimited JSON-RPC over standard input/output. Do not print logs to stdout; stdout is the protocol stream. Send diagnostics to stderr.

## 2. Tool design rules

- Define the smallest useful input schema.
- Allow-list paths and reject traversal before filesystem access.
- Permit HTTPS only; block loopback, link-local, and private network targets in production.
- Cap bytes, response time, and result count.
- Never expose environment variables wholesale.
- Require explicit agent approval for network tools.
- Return structured errors without stack traces or credentials.

## 3. Exercise: call a local tool

Send an initialize request from a second terminal:

```powershell
'{"jsonrpc":"2.0","id":1,"method":"initialize","params":{}}' | pnpm exec tsx chapter-07-mcp-extensions-custom-skills/mcp-server.ts
```

Then request tool metadata:

```json
{"jsonrpc":"2.0","id":2,"method":"tools/list","params":{}}
```

## 4. Custom skill lifecycle

Document each skill with trigger phrases, required inputs, forbidden actions, output schema, and verification command. Version skills with the repository, review prompt-injection exposure, and remove skills that are not used. A skill is an interface contract, not an invitation to grant shell access.


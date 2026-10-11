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

## 5. Recommended frontend and product skills

Register skills that make the agent produce consistent work:

| Skill | Input | Output | Gate |
|---|---|---|---|
| UI architecture | route, entities, responsive target | component tree and state map | typed props |
| Design critique | screenshot or route | hierarchy, contrast, spacing findings | no code change |
| Accessibility audit | page URL or component | keyboard, ARIA, contrast report | WCAG checklist |
| API contract | feature description | request/response schema | validation tests |
| Database migration | entity change | SQL/migration plus rollback | dry-run and backup |
| Threat model | data flow | abuse cases and mitigations | security review |
| Release checklist | Git SHA and environment | deploy/rollback steps | smoke tests |

Use skills from official vendor registries or reviewed repositories. Pin versions, inspect source before installation, and do not grant an arbitrary plugin shell access merely because it advertises “agentic” features.

## 6. MCP registry examples

For a VS Code/Continue-style configuration:

```json
{
  "mcpServers": {
    "filesystem-docs": {
      "command": "pnpm",
      "args": ["exec", "tsx", "chapter-07-mcp-extensions-custom-skills/mcp-server.ts"],
      "env": { "MCP_DOCS_ROOT": "${workspaceFolder}" }
    },
    "github-readonly": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_READONLY_TOKEN}" }
    }
  }
}
```

For Claude Desktop on Windows, the usual user configuration is `%APPDATA%\\Claude\\claude_desktop_config.json`; on macOS it is `~/Library/Application Support/Claude/claude_desktop_config.json`. Create the parent folder if it does not exist, edit with a JSON-aware editor, restart the desktop app, and inspect the MCP logs.

## 7. Plugin safety

Before enabling a plugin, record publisher, repository, commit/tag, requested permissions, network destinations, environment variables, filesystem paths, and update mechanism. Start with no credentials and a disposable project. A frontend plugin should not be able to read `.env`, modify DNS, run migrations, or push to GitHub.

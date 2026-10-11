# Practical Lab 07 — Install, Register, Use, and Remove an MCP Integration

## Starting point

Complete Lab 06. Use an agent that supports MCP configuration. This lab uses the repository's local documentation server and does not require a paid API.

## Installation

```bash
pnpm install --frozen-lockfile
```

## Configuration

Create an agent MCP entry. Continue-style JSON:

```json
{
  "mcpServers": {
    "launchpad-docs": {
      "command": "pnpm",
      "args": ["exec", "tsx", "chapter-07-mcp-extensions-custom-skills/mcp-server.ts"],
      "env": { "MCP_DOCS_ROOT": "${workspaceFolder}" }
    }
  }
}
```

Claude Desktop paths:

```text
Windows: %APPDATA%\Claude\claude_desktop_config.json
macOS:   ~/Library/Application Support/Claude/claude_desktop_config.json
Linux:   ~/.config/Claude/claude_desktop_config.json
```

Create the parent folder, edit the file in a JSON editor, save, and fully restart the agent application.

## Execution

Start the server manually:

```bash
MCP_DOCS_ROOT="$PWD" pnpm exec tsx chapter-07-mcp-extensions-custom-skills/mcp-server.ts
```

Send protocol requests from another terminal:

```bash
printf '%s\n' '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{}}' | pnpm exec tsx chapter-07-mcp-extensions-custom-skills/mcp-server.ts
printf '%s\n' '{"jsonrpc":"2.0","id":2,"method":"tools/list","params":{}}' | pnpm exec tsx chapter-07-mcp-extensions-custom-skills/mcp-server.ts
```

Now ask the agent: “Use `launchpad-docs` to read `chapter-08-backend-pipelines-concurrency/README.md`, then summarize the request pipeline.” Confirm the tool call in the agent transcript.

## Expected result

The agent discovers `read_documentation`, returns the requested chapter content, and cannot read a path outside the configured root.

## Verification

Attempt traversal and confirm a structured error:

```bash
printf '%s\n' '{"jsonrpc":"2.0","id":3,"method":"tools/call","params":{"name":"read_documentation","arguments":{"path":"../.env"}}}' | pnpm exec tsx chapter-07-mcp-extensions-custom-skills/mcp-server.ts
```

## Troubleshooting

| Problem | Fix |
|---|---|
| no tools appear | Restart the host application and inspect MCP logs |
| protocol JSON is corrupted | Move debug output to stderr; stdout must contain JSON-RPC only |
| file denied | Set `MCP_DOCS_ROOT` to the repository absolute path |
| tool reads too much | Keep the server's byte cap and narrow the requested path |

## Completion criteria

The learner can register, restart, discover, use, verify, and safely remove the MCP server without granting arbitrary shell or production database access.


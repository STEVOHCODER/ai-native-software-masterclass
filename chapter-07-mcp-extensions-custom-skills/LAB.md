# Practical Lab 07 — Install, Register, Use, and Remove an MCP Integration

## Starting point

Complete Lab 06. Use an agent that supports MCP configuration. This lab uses the repository's local documentation server and does not require a paid API.

## Installation

These commands install project dependencies using the selected package manager and its lockfile policy.

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

These commands execute this lab step; the surrounding explanation defines its expected result and reason for inclusion.

```bash
MCP_DOCS_ROOT="$PWD" pnpm exec tsx chapter-07-mcp-extensions-custom-skills/mcp-server.ts
```

Send protocol requests from another terminal:

These commands send one deterministic protocol request to the process so its response can be verified.

```bash
printf '%s\n' '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{}}' | pnpm exec tsx chapter-07-mcp-extensions-custom-skills/mcp-server.ts
printf '%s\n' '{"jsonrpc":"2.0","id":2,"method":"tools/list","params":{}}' | pnpm exec tsx chapter-07-mcp-extensions-custom-skills/mcp-server.ts
```

Now ask the agent: “Use `launchpad-docs` to read `chapter-08-backend-pipelines-concurrency/README.md`, then summarize the request pipeline.” Confirm the tool call in the agent transcript.

## Expected result

The agent discovers `read_documentation`, returns the requested chapter content, and cannot read a path outside the configured root.

## Verification

Attempt traversal and confirm a structured error:

These commands send one deterministic protocol request to the process so its response can be verified.

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

## Command annotations: what and why

These commands install project dependencies using the selected package manager and its lockfile policy. They also execute this lab step; the surrounding explanation defines its expected result and reason for inclusion. They also send one deterministic protocol request to the process so its response can be verified.

```bash
pnpm install --frozen-lockfile                            # Install the exact MCP server and TypeScript toolchain.
MCP_DOCS_ROOT="$PWD" pnpm exec tsx chapter-07-mcp-extensions-custom-skills/mcp-server.ts # Start the server with the repository as its allowed root.
printf '%s\n' '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{}}' | pnpm exec tsx chapter-07-mcp-extensions-custom-skills/mcp-server.ts # Send the protocol handshake and print the server capabilities.
printf '%s\n' '{"jsonrpc":"2.0","id":2,"method":"tools/list","params":{}}' | pnpm exec tsx chapter-07-mcp-extensions-custom-skills/mcp-server.ts # Ask the server to advertise discoverable tools.
printf '%s\n' '{"jsonrpc":"2.0","id":3,"method":"tools/call","params":{"name":"read_documentation","arguments":{"path":"../.env"}}}' | pnpm exec tsx chapter-07-mcp-extensions-custom-skills/mcp-server.ts # Attempt traversal and prove the path boundary rejects it.
```

`MCP_DOCS_ROOT` is the trust boundary. `pnpm exec` runs the repository's selected TypeScript executor. `printf` produces one JSON-RPC line; the pipe feeds that line to the server. The traversal request is intentionally negative: a secure integration must demonstrate failure as well as success.

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

The host launches `pnpm`, passes fixed arguments, substitutes the workspace root, and then must be restarted so it reloads the registry. The agent's request to read a chapter proves the complete discovery-to-tool-result path.

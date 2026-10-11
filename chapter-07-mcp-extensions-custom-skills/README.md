# Chapter 07: MCP Extensions and Custom Skills

This server uses the Model Context Protocol JSON-RPC shape over standard input/output. It exposes narrowly scoped tools: reading documentation from an allow-listed directory, fetching HTTPS URLs, and returning a bounded environment index. It never executes arbitrary shell commands and never accepts path traversal.

Run it with `node --loader ts-node/esm mcp-server.ts` in a development environment or compile it before production. Put the server behind the agent's explicit tool approval policy.


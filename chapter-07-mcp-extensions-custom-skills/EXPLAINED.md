# Chapter 07 MCP Walkthrough

The MCP process reads one JSON-RPC request per input line and writes exactly one JSON-RPC response per line. `MCP_DOCS_ROOT` defines the allowed directory. `resolve` canonicalizes paths; the prefix check blocks `..` traversal. `readFile` is capped before returning text, HTTPS fetches require the `https:` protocol and a timeout, and environment listing exposes only safe metadata.

The configuration's `command` is the executable, `args` are its fixed startup parameters, and `env` supplies a workspace root without embedding a machine-specific path. Restarting the host reloads the registry. The agent's successful read of a chapter proves discovery, invocation, and response handling; the traversal request proves the boundary.


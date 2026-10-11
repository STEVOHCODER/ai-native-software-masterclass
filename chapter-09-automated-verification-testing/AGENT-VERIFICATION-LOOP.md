# Agent Verification Loop

## Acceptance record

```text
Task:
Files allowed:
Commands:
Expected behavior:
Observed behavior:
Security checks:
Reviewer:
Commit:
```

## Failure classification

| Failure | Agent action |
|---|---|
| Syntax/type error | fix code, rerun focused check |
| Assertion failure | inspect contract and test fixture |
| Dependency failure | stop and report package/runtime mismatch |
| Environment failure | report missing tool without weakening test |
| Security finding | stop implementation and escalate |

An agent must not change a test expectation simply because the implementation fails. First determine whether the requirement or implementation is wrong.

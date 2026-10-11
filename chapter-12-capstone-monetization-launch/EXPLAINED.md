# Chapter 12 Capstone Walkthrough

The capstone brief makes the product, user, AI operation, entities, security classification, acceptance tests, deployment target, and rollback target explicit before an agent changes code. The vertical-slice order moves from visible input to API validation, persistence, AI gateway, telemetry, tests, deployment, and DNS so every layer is exercised by one user journey.

The final evidence list proves operation rather than documentation: screenshots or recording show the UI, the Git SHA identifies the code, command output proves quality gates, database evidence proves state, DNS/TLS/WAF checks prove exposure, and known limitations prevent overclaiming.


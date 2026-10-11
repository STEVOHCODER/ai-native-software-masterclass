# Frontend Agent Brief

## Design input

Provide the agent with user goal, route, data contract, responsive breakpoints, typography tokens, color tokens, interaction states, accessibility requirements, and forbidden dependencies. Attach existing screenshots only when they are safe to share.

## Required output

1. Component tree.
2. TypeScript interfaces.
3. Loading/error/empty/success state table.
4. Keyboard and screen-reader behavior.
5. Exact files changed.
6. Commands executed and results.

## Review checklist

- No API credentials in browser code.
- No unbounded `dangerouslySetInnerHTML`.
- Inputs have labels and validation.
- Focus is visible and not trapped accidentally.
- Layout works at 320, 768, and 1440 pixels.
- Animations respect `prefers-reduced-motion`.
- Server failures produce recoverable UI states.

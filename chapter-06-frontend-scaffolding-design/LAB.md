# Practical Lab 06 — Have the Agent Build a Working Frontend

## Starting point

Complete Labs 01–05. The learner should have the agent configured and a backend endpoint available or a documented fallback fixture.

## Installation


Run these commands to install or execute the project tooling, then verify that the local implementation produces the expected result.

```bash
pnpm create vite launchpad-web --template react-ts
cd launchpad-web
pnpm install
pnpm add tailwindcss @tailwindcss/vite
```

## Configuration

Create `.env.local`:

```text
VITE_API_ORIGIN=http://127.0.0.1:3000
```

Ask the installed agent to inspect `App.tsx`, the API contract, and the frontend brief in this repository. Give it this exact task:

```text
Build the Launchpad Hub dashboard from the existing App.tsx contract.
Use React + TypeScript and Tailwind utilities only.
Implement loading, success, empty, error, offline snapshot, grid/list switching,
keyboard-visible focus, responsive 320px/768px/1440px layouts, and reduced motion.
Do not add a component library. Run typecheck, lint, and build.
```

## Execution


Run these commands to install or execute the project tooling, then verify that the local implementation produces the expected result.

```bash
pnpm run dev -- --host 127.0.0.1
```

Open `http://127.0.0.1:5173`. Click grid/list, stop the API to trigger the fallback, resize the browser, and navigate with Tab only.

## Expected result

The dashboard renders course cards, layout controls change the arrangement, a failed API request shows a safe warning, and the interface remains usable at mobile width and without a mouse.

## Verification


Run these commands to install or execute the project tooling, then verify that the local implementation produces the expected result.

```bash
pnpm run typecheck
pnpm run lint
pnpm run build
```

Manual evidence:

1. Screenshot at 320 px.
2. Screenshot at 1440 px.
3. Keyboard focus reaches both layout buttons.
4. DevTools shows no API secret in page source or requests.

## Troubleshooting

| Problem | Fix |
|---|---|
| Tailwind classes do nothing | Check the Vite plugin and restart dev server |
| API fallback never appears | Stop the API and reload with DevTools Network open |
| layout resets | Check browser local storage and the `hub-layout` key |
| TypeScript errors | Ask the agent to fix types without weakening `strict` mode |

## Completion criteria

The learner can demonstrate a working responsive interface, explain the state transitions, and provide passing build/type/lint evidence.

## Command annotations: what and why


Run these commands to install or execute the project tooling, then verify that the local implementation produces the expected result.

```bash
pnpm create vite launchpad-web --template react-ts # Generate a real React + TypeScript project from Vite's template.
cd launchpad-web                                      # Enter the generated application before installing its dependencies.
pnpm install                                           # Resolve the generated package manifest and create/update its lockfile.
pnpm add tailwindcss @tailwindcss/vite                # Add the utility CSS engine and its Vite integration.
```

The scaffold command creates the runnable frontend; Tailwind is installed rather than merely described so the agent has a real styling system to use.

```text
VITE_API_ORIGIN=http://127.0.0.1:3000                 # Public browser URL for the backend; never place a secret here.
```

`VITE_` variables are bundled into browser code. This is why the value may identify an API host but must never contain a provider key or database password.


Run these commands to install or execute the project tooling, then verify that the local implementation produces the expected result.

```bash
pnpm run dev -- --host 127.0.0.1                      # Start Vite and bind development traffic only to the local machine.
pnpm run typecheck                                     # Prove component props and API data are type-safe.
pnpm run lint                                          # Detect code-quality and unsafe-pattern violations.
pnpm run build                                         # Produce the production frontend bundle and catch build-only failures.
```

The browser actions are also tests: changing grid/list proves state control, stopping the API proves fallback behavior, resizing proves responsive layout, and Tab navigation proves keyboard access.

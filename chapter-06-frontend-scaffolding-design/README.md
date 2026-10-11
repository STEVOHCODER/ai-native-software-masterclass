# Chapter 06 — Frontend Scaffolding and Design Systems

## Outcome

You will turn the backend contract into a responsive, keyboard-accessible product interface. The lesson covers Vite/React setup, Tailwind utility composition, loading/error/empty states, local persistence, API cancellation, responsive layout, motion restraint, and visual QA.

## 1. Scaffold a real React application

```bash
pnpm create vite launchpad-web --template react-ts
cd launchpad-web
pnpm install
pnpm add tailwindcss @tailwindcss/vite
pnpm exec tailwindcss init -p
pnpm run dev -- --host 127.0.0.1
```

Copy `App.tsx` into `src/App.tsx`, configure the Vite Tailwind plugin, and keep the API origin in `VITE_API_ORIGIN`. Never embed server credentials in Vite variables; all `VITE_*` values are public.

## 2. Component contract

The dashboard must handle:

1. Loading: skeleton or explicit connecting state.
2. Success: progress cards with meaningful labels.
3. Empty: explain how to start the first course.
4. Error: show a safe message and local snapshot, never a stack trace.
5. Offline: keep layout preference and last safe view in local storage.

`App.tsx` uses typed data interfaces, abortable fetching, a visible error state, and a layout switch that works with keyboard focus and `aria-pressed`.

## 3. Design rules

- Use an eight-point spacing rhythm: `p-2`, `p-4`, `p-6`, `p-8`.
- Keep body text at readable contrast and line height.
- Use one primary action per surface.
- Prefer visible focus rings over custom cursor effects.
- Collapse columns before cards become narrower than their content.
- Animate state transitions with opacity/transform, not layout-janking height changes.
- Respect reduced motion with a global media query.

## 4. Browser verification

```bash
pnpm run build
pnpm exec vite preview --host 127.0.0.1
```

In browser DevTools, test at 320 px, 768 px, and 1440 px. Test keyboard-only navigation, 200% zoom, slow network, offline reload, and screen-reader labels. Confirm no API key appears in page source or network requests.

## 5. AI-agent frontend brief

Give the coding agent this bounded brief for a new screen:

```text
Build the /courses route in React + TypeScript.
Use existing Tailwind tokens and typed API data.
Create loading, error, empty, and success states.
Support keyboard navigation, 200% zoom, reduced motion, and 320px width.
Do not add a UI library or inline secrets.
Run pnpm run typecheck, pnpm run lint, and pnpm run build.
Return screenshots or exact visual verification steps.
```

Ask the agent to produce a component tree and state map before changing code. Review the DOM, focus order, network calls, and mobile breakpoints rather than accepting a screenshot alone.

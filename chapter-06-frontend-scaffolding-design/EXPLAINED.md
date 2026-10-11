# Chapter 06 Frontend Walkthrough

`pnpm create vite ... --template react-ts` generates a TypeScript React application. `pnpm install` resolves dependencies. `pnpm add tailwindcss @tailwindcss/vite` adds utility styling and the Vite integration. `VITE_API_ORIGIN` is public browser configuration, so it may identify an API host but must never contain a secret.

In `App.tsx`, interfaces describe the dashboard response, `useState` stores layout/data/status, `localStorage` preserves the layout choice, `AbortController` cancels an obsolete fetch, and the `catch` branch switches to the visible fallback state. The button's `aria-pressed` communicates the selected layout to assistive technology. The progress bar uses a typed percentage to control width; the UI never inserts unsanitized HTML.

The agent brief supplies acceptance criteria before implementation. Screenshots are evidence of layout; typecheck, lint, build, keyboard navigation, and network inspection are evidence of behavior.


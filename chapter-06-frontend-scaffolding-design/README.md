# Chapter 06: Frontend Scaffolding and Design Systems

Use a restrained dark canvas, high-contrast typography, and a consistent eight-point spacing rhythm. Keep primary actions visually dominant, preserve generous whitespace around content groups, and collapse multi-column layouts before text becomes unreadable. Motion should explain state changes, not decorate every interaction.

`App.tsx` is intentionally self-contained: it persists the selected layout, fetches dashboard data with cancellation, reports failures visibly, and supports keyboard-accessible layout controls. Tailwind utilities provide the complete visual surface.


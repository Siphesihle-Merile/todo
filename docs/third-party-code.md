# Third-Party Code

This document lists every third-party package installed for this project and the reason it was chosen.

## Dependencies

### better-sqlite3
A synchronous SQLite driver for Node.js. Chosen over an ORM (e.g. Prisma) because the application has a single table with a simple schema — an ORM would add configuration and a learning curve without meaningful benefit here. Synchronous queries also avoid unnecessary async/await boilerplate throughout the data layer.

### @dnd-kit/core
Provides the drag-and-drop engine used to move task cards between status columns. Chosen over the native HTML5 Drag and Drop API because native drag events fire inconsistently on nested child elements, causing visible flicker when dragging over a column with existing cards. dnd-kit performs proper collision detection and exposes a `DragOverlay` component that renders a smooth, cursor-following card independent of page layout.

### @dnd-kit/utilities
A small companion package to `@dnd-kit/core` providing the `CSS.Translate.toString()` helper, used to convert drag position data into a CSS transform. Installed alongside `@dnd-kit/core` rather than bundled, per the library's own package structure.

## Dev Dependencies

### vitest
The test runner used for all automated tests. Chosen because it runs TypeScript natively without a separate compilation step, and integrates cleanly with a Vite-based toolchain, which Next.js itself uses internally.

### @vitest/coverage-v8
Provides test coverage reporting for Vitest, based on Node's built-in V8 coverage engine. Optional tooling, included to allow generating a coverage report if needed.

### @types/better-sqlite3
TypeScript type definitions for `better-sqlite3`, since the library does not ship its own types.

## Not used

`@dnd-kit/sortable` (the reorder-within-a-list add-on for dnd-kit) was deliberately not installed. Tasks only need to move *between* columns (changing status), not be reordered *within* a column, so the base `@dnd-kit/core` package covers the full requirement without adding the sortable add-on's extra complexity.

All other packages (`next`, `react`, `react-dom`, `typescript`, `tailwindcss`, `eslint`, etc.) were installed automatically by `create-next-app` as part of the standard Next.js + TypeScript + Tailwind scaffold and were not selected individually.
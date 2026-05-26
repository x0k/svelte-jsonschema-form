# 0006. Custom Task Abstraction

The library implements its own `Task` state machine (`src/lib/task.svelte.ts`) instead of using an existing async state library (e.g. TanStack Query).

The goals are to reduce the number of dependencies, keep the bundle size small, and tailor the functionality to the library's needs.

---
name: sjsf-v2-migration
description: Migrate svelte-jsonschema-form codebases from v2 to v3. Use when upgrading SJSF packages, adapting to Svelte 5 runes, replacing removed properties (form.context, form.value, form.errors, getSnapshot), updating package names (shadcn4, flowbite3, skeleton5, sveltekit3), or fixing broken custom components.
---

# SJSF v2 to v3 Migration Guide

This skill guides migrating existing projects from `svelte-jsonschema-form` v2 (Svelte 4 stores) to v3 (Svelte 5 runes).

## Step 1: Update Package Names and Dependencies

SJSF v3 updates major UI framework integrations:

```bash
# Remove deprecated v2 packages
pnpm remove @sjsf/shadcn-theme @sjsf/flowbite-theme @sjsf/skeleton4-theme @sjsf/sveltekit

# Install v3 packages
pnpm add @sjsf/form@latest @sjsf/shadcn4-theme@latest @sjsf/ajv8-validator@latest
# If using SvelteKit:
pnpm add @sjsf/sveltekit3@latest
```

---

## Step 2: Update `defaults.ts`

In v3, the `validator` option requires a `FormValidator<T>` created via `createFormValidator`:

```ts
// src/lib/sjsf/defaults.ts
export { resolver } from "@sjsf/form/resolvers/basic";
export { theme } from "@sjsf/shadcn4-theme";
export { translation } from "@sjsf/form/translations/en";
export { createFormMerger as merger } from "@sjsf/form/mergers/modern";
// Note: use createFormValidator factory
export { createFormValidator as validator } from "@sjsf/ajv8-validator";
export { createFormIdBuilder as idBuilder } from "@sjsf/form/id-builders/modern";
```

---

## Step 3: Replace Removed Form Properties

v3 removes store subscriptions (`$form`) and legacy properties from the `FormState` object:

### `form.value` Removal
- **Snapshot read**: Import and use `getValueSnapshot(form)` from `@sjsf/form`.
- **Reactive state**: In v3, pass `value: [() => state, (v) => state = v]` to `createForm`.

### `form.errors` Removal
- Access validation errors via `form.submission.errors` or query function `getFieldErrorsByPath(form, path)`.

### `form.context` Removal
- Internal context is no longer directly accessed. Use exported query helper functions (`getComponent`, `retrieveUiOption`, `getIdByPath`) or `getFormContext()`.

### `getSnapshot` Option Removal
- Removed. Use `getValueSnapshot(form)`.

---

## Step 4: Upgrade Custom Components to Svelte 5 Runes

Convert legacy `export let` components to Svelte 5 `$props()` with `$bindable()`:

```svelte
<!-- Before (v2 Svelte 4) -->
<script>
  export let value = "";
  export let config;
</script>
<input bind:value />

<!-- After (v3 Svelte 5) -->
<script lang="ts">
  import type { ComponentProps } from "@sjsf/form";

  let {
    value = $bindable(),
    config,
    handlers
  }: ComponentProps["textWidget"] = $props();
</script>

<input
  id={config.id}
  bind:value
  disabled={config.disabled}
  oninput={handlers.input}
  onblur={handlers.blur}
/>
```

See [Breaking Changes Checklist](references/breaking-changes-checklist.md) for full comparison tables and component prop changes.

---

## Gotchas & Rules

1. **No Store Subscriptions (`$`)**: `createForm()` now returns a plain reactive `FormState` object powered by Svelte 5 runes. Do not prepend `$` when reading properties (`form.submission`, `form.isChanged`).
2. **Nullable Fields Mandate**: SJSF v3 enforces that field widgets must not crash when receiving `null` or `undefined`.
3. **Reactive Options Syntax**: In v2, options could be updated via stores. In v3, pass getter functions for any option that can change reactively:
   ```ts
   createForm({
     ...defaults,
     schema: () => reactiveSchema
   });
   ```

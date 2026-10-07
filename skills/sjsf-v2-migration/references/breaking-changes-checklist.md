# SJSF v2 to v3 Breaking Changes Checklist

Use this checklist when auditing an existing SJSF v2 codebase.

## 1. Package Renames

| Old v2 Package | New v3 Package |
| :--- | :--- |
| `@sjsf/shadcn-theme` | `@sjsf/shadcn4-theme` (for Tailwind v4) |
| `@sjsf/daisyui-theme` | `@sjsf/daisyui5-theme` |
| `@sjsf/flowbite-theme` | `@sjsf/flowbite3-theme` |
| `@sjsf/skeleton3-theme` / `skeleton4-theme` | `@sjsf/skeleton5-theme` |
| `@sjsf/sveltekit` | `@sjsf/sveltekit3` |

---

## 2. Form Instance Property Removals

| v2 Pattern | v3 Replacement |
| :--- | :--- |
| `form.context` | Removed. Use exported query functions (`getComponent`, `retrieveUiOption`) or `getFormContext()`. |
| `form.value` | Removed. Use `getValueSnapshot(form)` for snapshot, or pass `value: [() => state, (v) => state = v]` for controlled forms. |
| `form.errors` | Removed. Access via `form.submission.errors` or `getFieldErrorsByPath(form, path)`. |
| `getSnapshot` option | Removed. Replaced by `getValueSnapshot(form)`. |
| `$form` (store subscription) | SJSF v3 uses Svelte 5 runes (`FormState` interface). Access properties directly without `$` prefix. |

---

## 3. Validator Option Requirement

In v2, validator functions could be passed directly.
In v3, the `validator` option **must** return a `FormValidator<T>`:

```ts
// v2
import { validator } from "@sjsf/ajv8-validator";

// v3
import { createFormValidator as validator } from "@sjsf/ajv8-validator";
```

---

## 4. Custom Components Migration

- Replace `export let value` with Svelte 5 `$props()`:
  ```svelte
  <!-- v2 -->
  <script>
    export let value;
    export let config;
  </script>

  <!-- v3 -->
  <script lang="ts">
    import type { ComponentProps } from "@sjsf/form";
    let { value = $bindable(), config, handlers }: ComponentProps["textWidget"] = $props();
  </script>
  ```
- Use `handlers.input` and `handlers.blur` instead of dispatching events.
- All field components must safely accommodate nullable values (`null` / `undefined`).

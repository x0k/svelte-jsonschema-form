---
name: sjsf-form-setup
description: Initialize and configure svelte-jsonschema-form (v3) in Svelte 5 projects. Use when creating new forms, configuring createForm options (validator, theme, merger, idBuilder), setting up reusable defaults, initializing form values, or handling submissions.
---

# SJSF Form Setup

This skill guides the setup and configuration of forms using `svelte-jsonschema-form` (v3) with Svelte 5.

## Step 1: Install Core Packages

Choose a theme and a validator:

```bash
# Core package
pnpm add @sjsf/form

# Theme (choose one, e.g. shadcn4 or daisyui5 or basic)
pnpm add @sjsf/shadcn4-theme bits-ui clsx tailwind-merge

# Validator (Ajv v8 recommended for Draft-07)
pnpm add @sjsf/ajv8-validator ajv ajv-formats
```

See [Themes and Validators Matrix](references/themes-and-validators.md) for alternative packages (Zod, Valibot, Skeleton, Flowbite).

---

## Step 2: Create Reusable Defaults (`src/lib/sjsf/defaults.ts`)

SJSF favors explicit modular imports over heavy globals. Create a central `defaults.ts` to re-export standard configurations:

```ts
// src/lib/sjsf/defaults.ts
export { resolver } from "@sjsf/form/resolvers/basic";
export { theme } from "@sjsf/shadcn4-theme"; // Or @sjsf/basic-theme, @sjsf/daisyui5-theme, etc.
export { translation } from "@sjsf/form/translations/en";
export { createFormMerger as merger } from "@sjsf/form/mergers/modern";
export { createFormValidator as validator } from "@sjsf/ajv8-validator";
export { createFormIdBuilder as idBuilder } from "@sjsf/form/id-builders/modern";
```

Add side-effect `include` imports for extra fields/widgets you use
(e.g. `import "@sjsf/form/fields/extra/file-include"`).

---

## Step 3: Define Schema and Render Form

In a Svelte 5 component (`+page.svelte` or form component):

```svelte
<script lang="ts">
  import { createForm, BasicForm, type Schema } from "@sjsf/form";
  import * as defaults from "$lib/sjsf/defaults";

  const schema = {
    type: "object",
    title: "User Profile",
    properties: {
      username: { type: "string", title: "Username", minLength: 3 },
      email: { type: "string", title: "Email", format: "email" },
      age: { type: "integer", title: "Age", minimum: 18 },
    },
    required: ["username", "email"],
  } as const satisfies Schema;

  const form = createForm({
    ...defaults,
    schema,
    onSubmit(data, event) {
      console.log("Validated form submission:", data);
    },
    onSubmitError(result, event, form) {
      console.error("Submission failed validation:", result);
    },
  });
</script>

<BasicForm {form} />
```

For quick prototyping without accessing form state directly, use `<SimpleForm>`:

```svelte
<script lang="ts">
  import { SimpleForm } from "@sjsf/form";
  import * as defaults from "$lib/sjsf/defaults";
</script>

<SimpleForm {...defaults} {schema} onSubmit={(data) => console.log(data)} />
```

---

## Step 4: Initialize Form Values

Pass `initialValue` to seed the form. SJSF merges schema defaults into it:

```svelte
<script lang="ts">
  const form = createForm({
    ...defaults,
    schema,
    initialValue: { username: "octocat" },
    onSubmit(data) {
      console.log("Submitted:", data);
    },
  });
</script>

<BasicForm {form} />
```

Use `setValue(form, value)` to replace the whole form value, `setValueAtPath` /
`updateValueAtPath` to edit a field, and `reset(form)` to restore
`initialValue`. Use `getValue(form)` for a live, non-copying read; in a
reactive context it tracks only the properties you read. Treat it as read-only
and use the value commands to update the form. Use `getValueSnapshot(form)`
when you need a detached copy. See
[Form Options Reference](references/form-options.md) for complete configuration
options and value mutation guidance.

---

## Gotchas & Rules

1. **JSON Schema Draft-07 Only**: SJSF natively processes Draft-07 schemas. `$schema` declarations are ignored.
2. **Reactive Options via Getters**: All options support Svelte 5 reactivity through JS getters:
   ```ts
   let schema: Schema = $state.raw({ ... });
   const form = createForm({
     ...defaults,
     get schema() {
       return schema;
     }
   });
   ```
   Never recreate `form` to apply new options.
3. **Array Mutations**: Use `insertArrayItem`, `removeArrayItem`, `moveArrayItem`, or `swapArrayItems` to change arrays so item keys stay in sync. Use `setValueAtPath` to replace an array element and `updateValueAtPath` for in-place object updates; annotate the callback parameter with the expected value type to avoid casts. These value commands accept a plain `RPath` array; passing a registered `FieldPath` skips the path lookup. `getChildPath` and `getPseudoPath` return a `FieldPath`, and `getSubtreePaths` / `getErrors` expose them when you need one.
4. **Local Definitions in `$ref`**: Only local JSON Pointer fragments (e.g. `#/definitions/address`) are supported for schema `$ref`. External URI `$ref` fetching is not supported.

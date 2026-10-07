---
name: sjsf-sveltekit
description: Integrate svelte-jsonschema-form with SvelteKit using @sjsf/sveltekit3. Use when building SvelteKit form actions with createAction, using SvelteKitForm with createMeta, configuring progressive enhancement, handling server validation errors, streaming JSON chunks, or using remote functions.
---

# SJSF SvelteKit Integration

This skill guides integrating `svelte-jsonschema-form` with SvelteKit using `@sjsf/sveltekit3`.

## Step 1: Install `@sjsf/sveltekit3`

```bash
pnpm add @sjsf/sveltekit3
```

Ensure your `src/lib/sjsf/defaults.ts` is configured with a validator, theme, and merger.
Use the ID builder from the integration package (`@sjsf/sveltekit3`),
not `@sjsf/form/id-builders/modern`.

---

## Step 2: Server Action Setup (`+page.server.ts`)

In `+page.server.ts`, define your `load` function and action using `createAction`:

```ts
// src/routes/posts/new/+page.server.ts
import type { InitialFormData } from "@sjsf/sveltekit3";
import { createAction } from "@sjsf/sveltekit3/server";
import type { Actions, PageServerLoad } from "./$types";
import * as defaults from "$lib/sjsf/defaults";

const schema = {
  type: "object",
  properties: {
    title: { type: "string", title: "Title", minLength: 3 },
    content: { type: "string", title: "Content" },
  },
  required: ["title"],
} as const;

type PostForm = { title: string; content?: string };

export const load: PageServerLoad = async () => {
  return {
    // Key MUST match action name
    postForm: {
      schema,
      initialValue: { title: "Draft", content: "" },
    } satisfies InitialFormData<PostForm>,
  };
};

export const actions: Actions = {
  default: createAction(
    {
      ...defaults,
      schema,
      name: "postForm",
      sendData: true,
    },
    ({ title, content }: PostForm) => {
      // Custom server-side validation error
      if (title.toLowerCase().includes("spam")) {
        return [{ path: ["title"], message: "Spam words not permitted" }];
      }

      // Business logic
      const id = "post-123";
      return { success: true, postId: id };
    }
  ),
};
```

---

## Step 3: Client Form Setup (`+page.svelte`)

In `+page.svelte`, connect client state to server metadata using `createMeta` and `<SvelteKitForm>`:

```svelte
<!-- src/routes/posts/new/+page.svelte -->
<script lang="ts">
  import { createMeta, SvelteKitForm } from "@sjsf/sveltekit3/client";
  import * as defaults from "$lib/sjsf/defaults";
  import type { ActionData, PageData } from "./$types";

  let { data, form }: { data: PageData; form: ActionData } = $props();

  // Extract metadata for action 'postForm'
  const meta = createMeta<ActionData, PageData>().postForm;
</script>

<SvelteKitForm
  {...defaults}
  {meta}
  refreshAll
  onSuccess={(result) => {
    // Server responded. result.type: "success" | "failure" | "redirect" | "error".
    // "failure" carries fail(400) validation errors in result.data.
  }}
  onFailure={(failure) => {
    // No usable response: request aborted, timed out, or threw.
  }}
  onSubmitError={(result) => {
    // Client-side submit validation failed. Nothing was sent.
  }}
/>
```

See [Form Actions API Reference](references/form-actions-api.md) for full options and Superforms comparison.

---

## Step 4: Progressive Enhancement

`<SvelteKitForm>` submits a standard POST with JavaScript disabled.
Limits in that mode:

- Create the action with `sendData: true` to persist form data between page updates.
- `oneOf` / `anyOf` / `dependencies` / `additionalProperties` / `additionalItems` do not expand or switch.
- Widgets needing JavaScript (e.g. multiselect) do not work.

For remote functions without form actions, see [Remote Functions Reference](references/remote-functions.md).

---

## Gotchas & Rules

1. **Name Matching Rule**: The identifier must match the `name` option (not the `actions` key) across 3 locations:
   - `load` return object key: `return { postForm: ... }`
   - `createAction` option: `name: "postForm"`
   - `createMeta` selector: `createMeta<...>().postForm`
2. **Server-Side Errors Return Format**: Custom errors returned from `createAction` handler must follow the format `[{ path: ["fieldName"], message: "Error text" }]`.
3. **No Duplicate Schemas**: Unlike Superforms, you do not need separate client and server schemas. The same JSON Schema Draft-07 validates both in the browser and in SvelteKit server endpoints.

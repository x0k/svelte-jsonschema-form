# SJSF Remote Functions Integration

For projects using SvelteKit remote functions (`data.remote.ts`, `form`/`query` from `$app/server`) instead of traditional form actions.
Your `defaults.ts` — same as the standard one, except `idBuilder`
comes from `@sjsf/sveltekit3/rf` instead of `@sjsf/form/id-builders/modern`:

```ts
// src/lib/sjsf/defaults.ts
export { resolver } from "@sjsf/form/resolvers/basic";
export { theme } from "@sjsf/basic-theme";
import "@sjsf/basic-theme/extra-widgets/textarea-include"; // side-effect includes you use
export { translation } from "@sjsf/form/translations/en";
export { createFormIdBuilder as idBuilder } from "@sjsf/sveltekit3/rf";
export { createFormMerger as merger } from "@sjsf/form/mergers/modern";
export { createFormValidator as validator } from "@sjsf/ajv8-validator";
```

## Server Validator (`data.remote.ts`)

Validate with `createServerValidator` + `form()` from `$app/server`.
It only takes `{ schema, validator, merger, uiSchema, uiOptionsRegistry, ... }` —
`idBuilder`/`theme`/`translation`/`resolver` are client-only
and ignored here (spreading is harmless but explicit picks are clearer):

```ts
// src/routes/posts/data.remote.ts
import { form } from "$app/server";
import { createServerValidator } from "@sjsf/sveltekit3/rf/server";
import * as defaults from "$lib/sjsf/defaults";

import { schema, uiSchema } from "./model";

const validator = createServerValidator<PostForm>({
  schema,
  validator: defaults.validator,
  merger: defaults.merger,
  uiSchema,
});

export const createPost = form(validator, ({ data }) => {
  console.log(data);
  // Custom field error: invalid({ path: ["title"], message: "..." })
});
```

## Client Connection (`+page.svelte`)

Build client options with `connect()`, pass to `createForm`:

```svelte
<script lang="ts">
  import { BasicForm, createForm } from "@sjsf/form";
  import { connect } from "@sjsf/sveltekit3/rf/client";
  import * as defaults from "$lib/sjsf/defaults";

  import { createPost } from "./data.remote";
  import { schema, uiSchema } from "./model";

  const form = createForm(
    await connect(createPost, {
      ...defaults,
      schema,
      uiSchema,
    })
  );
</script>

<BasicForm {form} />
```

`connect(remoteForm, options)` takes `Omit<FormOptions<T>, "idBuilder"> & ConnectOptions`, returns `Promise<FormOptions<T>>`. Submits through a hidden form.

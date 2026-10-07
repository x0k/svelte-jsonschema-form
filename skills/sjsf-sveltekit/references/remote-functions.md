# SJSF Remote Functions Integration

For projects using SvelteKit remote functions (`data.remote.ts`) instead of traditional form actions:

## Setup

1. **Remote Defaults** (`src/lib/sjsf/remote-defaults.ts`):
```ts
export { resolver } from "@sjsf/form/resolvers/basic";
export { theme } from "@sjsf/basic-theme";
export { translation } from "@sjsf/form/translations/en";
export { createFormMerger as merger } from "@sjsf/form/mergers/modern";
export { createFormValidator as validator } from "@sjsf/ajv8-validator";
export { createFormIdBuilder as idBuilder } from "@sjsf/form/id-builders/modern";
```

2. **Server Handler** (`src/routes/remote/+page.server.ts` or `data.remote.ts`):
```ts
import { command } from "$lib/server/remote";
import { schema } from "$lib/schema";
import * as defaults from "$lib/sjsf/remote-defaults";

export const saveProfile = command(async (input) => {
  const validator = defaults.validator();
  const result = await validator.validateFormData(input, schema);
  if (!result.valid) {
    return { success: false, errors: result.errors };
  }
  // Proceed with validated input
  return { success: true };
});
```

3. **Client Form Submission**:
Hook `onSubmit` into the remote command:
```svelte
<script lang="ts">
  import { createForm, BasicForm } from "@sjsf/form";
  import * as defaults from "$lib/sjsf/defaults";
  import { saveProfile } from "./data.remote";

  const form = createForm({
    ...defaults,
    schema,
    async onSubmit(val) {
      const res = await saveProfile(val);
      if (!res.success) {
        // Set server validation errors
      }
    }
  });
</script>

<BasicForm {form} />
```

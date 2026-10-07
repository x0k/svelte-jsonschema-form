<script lang="ts">
  import { setFormContext, Content, SubmitButton } from "@sjsf/form";
  import { createMeta, setupSvelteKitForm } from "@sjsf/sveltekit3/client";

  import * as defaults from "#lib/sjsf/defaults.js";

  import type { ActionData, PageData } from "./$types.js";

  const meta = createMeta<ActionData, PageData>().form;

  const { form } = setupSvelteKitForm(meta, {
    ...defaults,
    onValid: console.log,
  });
  setFormContext(form);
</script>

<form
  novalidate
  method="POST"
  style="display: flex; flex-direction: column; gap: 1rem;"
>
  <Content />
  <SubmitButton />
</form>

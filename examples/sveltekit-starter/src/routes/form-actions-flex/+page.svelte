<script lang="ts">
  import { BasicForm } from "@sjsf/form";
  import { createMeta, setupSvelteKitForm } from "@sjsf/sveltekit/client";

  import * as defaults from "$lib/form-defaults";

  import type { ActionData, PageData } from "./$types";

  const meta = createMeta<ActionData, PageData>().form;
  const { form } = setupSvelteKitForm(meta, {
    ...defaults,
    onSuccess: console.log,
  });
</script>

<BasicForm {form} method="POST" />

<script lang="ts">
  import { BasicForm, validate } from "@sjsf/form";
  import { createMeta, setupSvelteKitForm } from "@sjsf/sveltekit3/client";

  import * as defaults from "#lib/sjsf/defaults.js";

  import type { ActionData, PageData } from "./$types.js";

  const meta = createMeta<ActionData, PageData>().form;
  const { form, request } = setupSvelteKitForm(meta, {
    ...defaults,
    onSuccess: (result) => {
      if (result.type === "success") {
        console.log(result.data?.post);
      }
    },
  });
</script>

<BasicForm
  {form}
  method="POST"
  onsubmit={(e) => {
    e.preventDefault();
    void validate(form, {
      onValid: (value) => {
        void request.run(value, e);
      },
    });
  }}
/>

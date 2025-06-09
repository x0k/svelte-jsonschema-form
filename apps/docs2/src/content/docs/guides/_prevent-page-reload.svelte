<script lang="ts">
  import { Content, createForm, setFormContext } from "@sjsf/form";
  import { preventPageReload } from "@sjsf/form/prevent-page-reload.svelte";

  import * as defaults from "@/components/form-defaults";

  const form = createForm({
    ...defaults,
    schema: { type: "string" },
  });
  setFormContext(form.context);

  preventPageReload(form);
</script>

<Content />

<button
  style="width: 100%; padding: 0.5rem; margin-top: 1rem;"
  onclick={() => {
    window.location.reload();
  }}
>
  Reload page
</button>

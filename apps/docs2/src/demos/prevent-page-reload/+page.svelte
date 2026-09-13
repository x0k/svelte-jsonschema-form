<script lang="ts">
  import {
    Content,
    createForm,
    getValueSnapshot,
    setFormContext,
  } from "@sjsf/form";
  import { isSchemaValueDeepEqual } from "@sjsf/form/core";
  import { preventPageReload } from "@sjsf/form/prevent-page-reload.svelte";

  import { getDemoContext } from "@/lib/demo";

  const { defaults } = getDemoContext();

  const form = createForm({
    ...defaults,
    schema: { type: "string" },
  });
  setFormContext(form);

  const initialValue = getValueSnapshot(form);
  preventPageReload(
    () => !isSchemaValueDeepEqual(initialValue, getValueSnapshot(form))
  );
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

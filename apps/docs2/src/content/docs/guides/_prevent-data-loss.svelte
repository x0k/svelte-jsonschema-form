<script lang="ts">
  import { Content, setFromContext } from "@sjsf/form";
  import { preventDataLoss } from "@sjsf/form/prevent-data-loss.svelte";

  import { createCustomForm } from "@/components/custom-form";

  const form = createCustomForm({
    schema: { type: "string" },
  });
  setFromContext(form.context)

  preventDataLoss(form);
</script>

<Content {form} />

<button
  style="width: 100%; padding: 0.5rem;"
  onclick={() => {
    window.location.reload();
  }}
>
  Reload page
</button>

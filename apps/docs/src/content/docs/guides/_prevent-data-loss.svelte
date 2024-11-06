<script lang="ts">
  import { FormContent } from "@sjsf/form";
  import { preventDataLoss } from "@sjsf/form/prevent-data-loss.svelte";

  import { useCustomForm } from "@/components/custom-form";

  const form = useCustomForm({
    schema: { type: "string" },
  });

  preventDataLoss(form);
</script>

<FormContent bind:value={form.formValue} />

<button
  style="width: 100%; padding: 0.5rem;"
  onclick={() => {
    window.location.reload();
  }}
>
  Reload page
</button>

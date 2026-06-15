<script lang="ts">
  import Send from "@lucide/svelte/icons/send";
  import { SimpleForm } from "@sjsf/form";
  import { fromRecord } from "@sjsf/form/lib/resolver";

  import { getDemoContext } from "@/lib/demo";

  const { defaults } = getDemoContext();
</script>

<SimpleForm
  {...defaults}
  schema={{
    title: "With icons",
    type: "null",
  }}
  icons={fromRecord({
    submit,
  })}
/>

{#snippet submit()}
  Submit <Send size={12} />
{/snippet}

<script lang="ts">
  import type { Snippet } from "svelte";
  import type { Schema } from "@sjsf/form";

  import CustomForm from "@/components/custom-form.svelte";

  const { children: icon }: { children: Snippet } = $props();

  const schema: Schema = {
    title: "With icon",
  };
  let value = $state();
</script>

<CustomForm
  bind:value
  icons={{ submit: icon }}
  {schema}
  onSubmit={console.log}
/>

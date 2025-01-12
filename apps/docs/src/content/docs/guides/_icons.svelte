<script lang="ts">
  import type { Snippet } from "svelte";
  import { type Schema, SimpleForm } from "@sjsf/form";

  import { createCustomForm } from "@/components/custom-form";

  const { children }: { children: Snippet } = $props();

  const schema: Schema = {
    title: "With icons",
  };
  
  const form = createCustomForm({
    schema,
    icons: {
      submit: children
    }
  });
</script>

<SimpleForm {form} />

<script lang="ts">
  import type { Snippet } from "svelte";

  import { fromRecord } from "@sjsf/form/lib/resolver";

  import CustomForm from "@/components/my-form.svelte";

  const { children }: { children: Snippet } = $props();
</script>

<CustomForm
  schema={{
    title: "With icons",
  }}
  icons={fromRecord({
    submit: children,
  })}
/>

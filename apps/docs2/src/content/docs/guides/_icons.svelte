<script lang="ts">
  import type { Snippet } from "svelte";

  import { fromRecord } from "@sjsf/form/lib/resolver";

  import MyForm from "@/components/my-form.svelte";

  const { children }: { children: Snippet } = $props();
</script>

<MyForm
  schema={{
    title: "With icons",
  }}
  icons={fromRecord({
    submit: children,
  })}
/>

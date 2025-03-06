<script lang="ts">
  import type { Snippet } from "svelte";

  import CustomForm from '@/components/my-form.svelte';

  const { children }: { children: Snippet } = $props();
</script>

<CustomForm
  schema={{
    title: "With icons",
  }}
  icons={{
    submit: children
  }}
/>

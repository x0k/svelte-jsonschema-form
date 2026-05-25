<script lang="ts">
  import type { Snippet } from 'svelte';

  import '@sjsf/basic-theme/css/basic.css';

  const { children }: { children: Snippet } = $props()
</script>

{@render children()}

<script lang="ts">
  import type { Snippet } from "svelte";

  import { BitsConfig } from "bits-ui";

  const { children }: { children: Snippet } = $props();

  let portalEl = $state.raw() as HTMLDivElement;
</script>

<BitsConfig defaultPortalTo={portalEl}>
  {@render children()}
</BitsConfig>
<div bind:this={portalEl}></div>

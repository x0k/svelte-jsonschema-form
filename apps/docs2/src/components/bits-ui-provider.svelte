<script lang="ts">
  import { BitsConfig } from "bits-ui";
  import type { Snippet } from "svelte";

  const { children }: { children: Snippet } = $props();

  let portalEl = $state.raw() as HTMLDivElement;
</script>

<BitsConfig defaultPortalTo={portalEl}>
  {@render children()}
</BitsConfig>
<div bind:this={portalEl}></div>

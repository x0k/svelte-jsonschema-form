<script lang="ts">
  import type { Snippet } from "svelte";

  const {
    children,
    shadowRoot,
  }: { children: Snippet<[ShadowRoot]>; shadowRoot: ShadowRoot } = $props();
</script>

{@render children(shadowRoot)}

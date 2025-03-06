<script lang="ts">
  import type { Snippet } from "svelte";

  import type { Theme } from "@/shared";

  import { getShowcaseContext } from "./context";

  const { theme, children }: { theme: Theme; children: Snippet } = $props();

  const ctx = getShowcaseContext();

  // ctx.addTheme(theme, children);

  const display = $derived(ctx.selected === theme ? "block" : "none");
</script>

<div style:display>
  {@render children()}
</div>

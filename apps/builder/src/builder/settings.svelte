<script lang="ts">
  import { getBuilderContext } from "./context.svelte.js";

  const ctx = getBuilderContext();

  const selected = $derived(ctx.selectedNode());
</script>

{selected?.type ?? "no selected"}

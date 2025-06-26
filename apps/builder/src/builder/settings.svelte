<script lang="ts">
  import { getBuilderContext } from "./context.svelte.js";

  const ctx = getBuilderContext();
</script>

{ctx.selectedNode?.type ?? "no selected"}

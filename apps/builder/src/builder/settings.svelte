<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";

  import { getBuilderContext } from "./context.svelte.js";
  import NodeSettings from "./node-settings.svelte";

  const ctx = getBuilderContext();
</script>

<div class="flex flex-col gap-4">
  <div class="font-medium text-lg">Form settings</div>
  <Button>Compile</Button>
  {#if ctx.selectedNode}
    {#key ctx.selectedNode.id}
      <NodeSettings
        bind:node={() => ctx.selectedNode!, (n) => ctx.updateSelectedNode(n)}
      />
    {/key}
  {/if}
</div>

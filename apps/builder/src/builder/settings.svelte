<script lang="ts">
  import {
    type CustomizableNode,
    isCustomizableNode,
  } from "$lib/builder/index.js";
  import { Button } from "$lib/components/ui/button/index.js";

  import { getBuilderContext } from "./context.svelte.js";
  import NodeSettings from "./node-settings.svelte";

  const ctx = getBuilderContext();
</script>

<div class="flex flex-col gap-4">
  <Button disabled={ctx.rootNode === undefined}>Build</Button>
  {#if ctx.selectedNode && isCustomizableNode(ctx.selectedNode)}
    {#key ctx.selectedNode.id}
      <NodeSettings
        bind:node={
          () => ctx.selectedNode as CustomizableNode,
          (n) => ctx.updateSelectedNode(n)
        }
      />
    {/key}
  {/if}
</div>

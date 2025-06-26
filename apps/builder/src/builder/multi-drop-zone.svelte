<script lang="ts">
  import type { NodeId, Node } from "$lib/builder/builder.js";

  import { getBuilderContext } from "./context.svelte.js";
  import DropIndicator from "./drop-indicator.svelte";
  import RootNode from "./root-node.svelte";

  interface Props {
    nodeIds: NodeId[];
    onDrop: (node: Node, index: number) => void;
    unmount: (index: number) => void;
  }

  const { nodeIds, onDrop, unmount }: Props = $props();

  const ctx = getBuilderContext();
  const droppable = ctx.createDroppable({
    onDrop(node) {
      onDrop(node, 0);
    },
  });
</script>

{#if nodeIds.length === 0}
  <div
    class={[
      "border-2 border-dashed rounded p-6 ",
      droppable.isOver && "border-primary bg-primary/5",
    ]}
    {@attach droppable.attach}
  >
    <p class="text-lg text-center font-medium text-foreground">
      Drop form elements here
    </p>
  </div>
{:else}
  {#each nodeIds as nodeId, i (nodeId)}
    <DropIndicator
      onDrop={(node) => {
        onDrop(node, i);
      }}
    />
    <RootNode
      nodeId={nodeIds[i]}
      unmount={() => {
        unmount(i);
      }}
    />
  {/each}
  <DropIndicator
    onDrop={(node) => {
      onDrop(node, nodeIds.length);
    }}
  />
{/if}

<script lang="ts">
  import type { Node } from "$lib/builder/builder.js";

  import { getBuilderContext, getNodeContext } from "./context.svelte.js";
  import DropIndicator from "./drop-indicator.svelte";
  import RootNode from "./root-node.svelte";

  interface Props {
    nodes: Node[];
  }

  const { nodes = $bindable() }: Props = $props();

  const ctx = getBuilderContext();
  const nodeCtx = getNodeContext()
  const onDrop = (node: Node, index: number) => {
    nodes.splice(index, 0, node);
    ctx.selectNode(() => nodes.find((n) => n.id === node.id));
  };
  const droppable = ctx.createDroppable(nodeCtx, {
    onDrop(node) {
      onDrop(node, 0);
    },
  });
</script>

{#if nodes.length === 0}
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
  {#each nodes as nodeId, i (nodeId)}
    <DropIndicator
      onDrop={(node) => {
        onDrop(node, i);
      }}
    />
    <RootNode
      bind:node={nodes[i]}
      unmount={() => {
        nodes.splice(i, 1);
      }}
    />
  {/each}
  <DropIndicator
    onDrop={(node) => {
      onDrop(node, nodes.length);
    }}
  />
{/if}

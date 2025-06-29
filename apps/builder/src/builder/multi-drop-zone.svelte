<script lang="ts">
  import type { Snippet } from "svelte";

  import type { Node } from "$lib/builder/index.js";

  import { getBuilderContext, getNodeContext } from "./context.svelte.js";
  import DropZone from "./drop-zone.svelte";
  import DropIndicator from "./node-drop-indicator.svelte";

  interface Props {
    nodes: Node[];
    item: Snippet<[number]>;
  }

  const { nodes = $bindable(), item }: Props = $props();

  const ctx = getBuilderContext();
  const nodeCtx = getNodeContext();
  const onDrop = (node: Node, index: number) => {
    nodes.splice(index, 0, node);
    ctx.selectNode({
      current() {
        return nodes.find((n) => n.id === node.id);
      },
      update(newNode) {
        const idx = nodes.findIndex((n) => n.id === node.id);
        nodes[idx] = newNode;
      },
    });
  };
  const droppable = ctx.createNodeDroppable(nodeCtx, {
    onDrop(node) {
      onDrop(node, 0);
    },
  });
</script>

{#if nodes.length === 0}
  <DropZone placeholder="Drop form elements here" {droppable} />
{:else}
  {#each nodes as nodeId, i (nodeId)}
    <DropIndicator
      onDrop={(node) => {
        onDrop(node, i);
      }}
    />
    {@render item(i)}
  {/each}
  <DropIndicator
    onDrop={(node) => {
      onDrop(node, nodes.length);
    }}
  />
{/if}

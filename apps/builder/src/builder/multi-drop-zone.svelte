<script lang="ts">
  import type { Node } from "$lib/builder/builder.js";

  import { createDroppable, getBuilderContext } from "./context.svelte.js";
  import DropIndicator from "./drop-indicator.svelte";
  import RootNode from "./root-node.svelte";

  interface Props {
    nodes: Node[];
  }

  const { nodes = $bindable() }: Props = $props();

  const ctx = getBuilderContext();
</script>

{#if nodes.length === 0}
  {@const droppable = createDroppable(ctx, {
    onDrop(node) {
      nodes.push(node);
    },
  })}
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
    <!-- <p class="text-sm text-muted-foreground">
      Drag element from the sidebar to start building your form
    </p> -->
  </div>
{:else}
  {#each nodes as node, i (node.id)}
    <DropIndicator
      onDrop={(node) => {
        nodes.splice(i, 0, node);
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
      nodes.push(node);
    }}
  />
{/if}

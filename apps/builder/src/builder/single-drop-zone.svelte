<script lang="ts">
  import type { Node, NodeId } from "$lib/builder/index.js";

  import { getBuilderContext } from "./context.svelte.js";
  import RootNode from "./root-node.svelte";

  interface Props {
    nodeId: NodeId | undefined;
    onDrop: (node: Node) => void;
    unmount: () => void;
  }

  const { nodeId, onDrop, unmount }: Props = $props();

  const ctx = getBuilderContext();
  const droppable = ctx.createDroppable({
    onDrop,
  });
</script>

{#if nodeId}
  <RootNode {nodeId} {unmount} />
{:else}
  <div
    class={[
      "border-2 border-dashed rounded p-6",
      droppable.isOver && "border-primary bg-primary/5",
    ]}
    {@attach droppable.attach}
  >
    <p class="text-lg text-center font-medium text-foreground">
      Drop form element here
    </p>
    <!-- <p class="text-sm text-muted-foreground">
      Drag element from the sidebar to start building your form
    </p> -->
  </div>
{/if}

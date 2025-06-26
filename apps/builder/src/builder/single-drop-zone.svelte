<script lang="ts">
  import type { Node } from "$lib/builder/index.js";

  import { getBuilderContext, getNodeContext } from "./context.svelte.js";
  import RootNode from "./root-node.svelte";

  interface Props {
    node: Node | undefined;
  }

  let { node = $bindable() }: Props = $props();

  const ctx = getBuilderContext();
  const nodeCtx = getNodeContext();
  const droppable = ctx.createDroppable(nodeCtx, {
    onDrop(newNode) {
      node = newNode;
      ctx.selectNode(() => node);
    },
  });
</script>

{#if node}
  <RootNode bind:node unmount={() => (node = undefined)} />
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

<script lang="ts">
  import type { Node } from "$lib/builder/index.js";

  import {
    getBuilderContext,
    getNodeContext,
    type NodeRef,
  } from "./context.svelte.js";
  import RootNode from "./root-node.svelte";

  interface Props {
    node: Node | undefined;
    placeholder?: string;
  }

  let { node = $bindable(), placeholder = "Drop form element here" }: Props =
    $props();

  const ctx = getBuilderContext();
  const nodeCtx = getNodeContext();
  const nodeRef: NodeRef = {
    current() {
      return node;
    },
    update(n) {
      node = n;
    },
  };
  const droppable = ctx.createDroppable(nodeCtx, {
    onDrop(newNode) {
      node = newNode;
      ctx.selectNode(nodeRef);
    },
  });
</script>

{#if node}
  <RootNode bind:node unmount={() => (node = undefined)} />
{:else}
  <div
    class={[
      "border-2 border-dashed rounded p-6 w-full h-full flex items-center justify-center",
      droppable.isOver && "border-primary bg-primary/5",
    ]}
    {@attach droppable.attach}
  >
    <p class="text-lg font-medium text-foreground">
      {placeholder}
    </p>
    <!-- <p class="text-sm text-muted-foreground">
      Drag element from the sidebar to start building your form
    </p> -->
  </div>
{/if}

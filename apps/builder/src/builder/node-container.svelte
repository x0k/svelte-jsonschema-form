<script lang="ts">
  import type { Snippet } from "svelte";

  import type { SelectableNode } from "$lib/builder/index.js";

  import {
    getBuilderContext,
    type BuilderDraggable,
    type NodeRef,
  } from "./context.svelte.js";

  interface Props {
    node: SelectableNode;
    draggable: BuilderDraggable;
    children: Snippet;
  }

  let { children, node = $bindable(), draggable }: Props = $props();

  const ctx = getBuilderContext();
  const nodeRef: NodeRef = {
    current() {
      return node;
    },
    update(v) {
      node = v;
    },
  };
  const selectNode = (e: Event) => {
    e.stopPropagation();
    ctx.selectNode(nodeRef);
  };
</script>

<div
  role="button"
  tabindex="0"
  onkeydown={(e) => {
    if (e.code === "Enter" || e.code === "Space") {
      selectNode(e);
    }
  }}
  onclick={selectNode}
  class={[
    "rounded p-2 flex-1 flex flex-col gap-0.5 border bg-background",
    ctx.selectedNode?.id === node.id && "border-primary",
    draggable.isDragged && "opacity-70",
  ]}
  {@attach draggable.attach}
>
  {@render children?.()}
</div>

<script lang="ts">
  import type { Snippet } from "svelte";

  import type { SelectableNode } from "$lib/builder/index.js";

  import {
    getBuilderContext,
    type BuilderDraggable,
    type NodeRef,
  } from "./context.svelte.js";
  import Container from "./container.svelte";

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

<Container
  builderDraggable={draggable}
  role="button"
  tabindex={0}
  onkeydown={(e) => {
    if (e.code === "Enter" || e.code === "Space") {
      selectNode(e);
    }
  }}
  onclick={selectNode}
  class={[
    "flex-1 flex flex-col gap-0.5",
    ctx.selectedNode?.id === node.id && "border-primary",
  ]}
>
  {@render children?.()}
</Container>

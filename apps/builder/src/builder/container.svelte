<script lang="ts">
  import type { Snippet } from "svelte";
  import type { ClassValue } from "svelte/elements";

  import type { Node } from "$lib/builder/index.js";
  import { cn } from "$lib/utils.js";

  import {
    getBuilderContext,
    type BuilderDraggable,
    type NodeRef,
  } from "./context.svelte.js";

  interface Props {
    class?: ClassValue;
    node: Node;
    draggable: BuilderDraggable;
    children: Snippet;
    disableSelection?: boolean;
  }

  let {
    node = $bindable(),
    class: className,
    draggable,
    children,
    disableSelection,
  }: Props = $props();

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
    if (disableSelection) {
      return;
    }
    ctx.selectNode(nodeRef);
  };
</script>

<div
  {@attach draggable.attach}
  class={cn(
    "rounded-md p-2 border bg-background",
    draggable.isDragged && "opacity-70",
    ctx.selectedNode?.id === node.id && "border-primary",
    className
  )}
  role="button"
  tabindex={0}
  onkeydown={(e) => {
    if (e.code === "Enter" || e.code === "Space") {
      selectNode(e);
    }
  }}
  onclick={selectNode}
>
  {@render children?.()}
</div>

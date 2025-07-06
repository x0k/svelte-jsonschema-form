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
  import Container from "./container.svelte";

  interface Props {
    node: Node;
    draggable: BuilderDraggable;
    showRequired: boolean;
    children: Snippet;
    class?: ClassValue;
    invalid?: boolean;
    disableSelection?: boolean;
    onSelect?: () => void;
  }

  let {
    node = $bindable(),
    class: className,
    draggable,
    children,
    invalid,
    disableSelection,
    onSelect,
    showRequired,
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
    ctx.selectNode(nodeRef, showRequired);
    onSelect?.();
  };
</script>

<Container
  {@attach draggable.attach}
  class={cn(
    draggable.isDragged && "opacity-70",
    ctx.selectedNode?.id === node.id
      ? "border-primary"
      : invalid && "border-chart-5",
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
  {children}
/>

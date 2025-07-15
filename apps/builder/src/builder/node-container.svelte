<script lang="ts">
  import type { Snippet } from "svelte";
  import type { ClassValue } from "svelte/elements";

  import {
    ERROR_STATUS,
    OK_STATUS,
    WARNING_STATUS,
    type Node,
    type OperatorStatus,
  } from "$lib/builder/index.js";
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
    status?: OperatorStatus;
    disableSelection?: boolean;
    onSelect?: () => void;
  }

  let {
    node = $bindable(),
    class: className,
    draggable,
    children,
    disableSelection,
    onSelect,
    showRequired,
    status = OK_STATUS,
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
  const error = $derived(
    status & ERROR_STATUS || ctx.errors[node.id] !== undefined
  );
  const warning = $derived(
    status & WARNING_STATUS || ctx.warnings[node.id] !== undefined
  );
</script>

<Container
  {@attach draggable.attach}
  class={cn(
    draggable.isDragged && "opacity-70",
    ctx.selectedNode?.id === node.id
      ? "border-primary"
      : error
        ? "border-destructive"
        : warning && "border-chart-3",
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

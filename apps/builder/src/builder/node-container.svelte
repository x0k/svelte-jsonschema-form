<script lang="ts">
  import type { Snippet } from "svelte";

  import type { Node } from "$lib/builder/builder.js";

  import {
    getBuilderContext,
    getSelectedNode,
    setSelectedNode,
  } from "./context.svelte.js";

  interface Props {
    children: Snippet;
    node: Node;
  }

  const { children, node }: Props = $props();

  const ctx = getBuilderContext();
  const nodeAccessor = () => node;

  const selectedNode = $derived(getSelectedNode(ctx));
</script>

<div
  role="button"
  tabindex="0"
  onkeydown={(e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.stopPropagation();
      setSelectedNode(ctx, nodeAccessor);
    }
  }}
  onclick={(e) => {
    e.stopPropagation();
    setSelectedNode(ctx, nodeAccessor);
  }}
  class={[
    "border rounded p-2 flex flex-col gap-2",
    selectedNode?.id === node.id ? "bg-primary/5" : "bg-background",
  ]}
>
  {@render children()}
</div>

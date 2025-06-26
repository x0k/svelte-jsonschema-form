<script lang="ts">
  import type { Snippet } from "svelte";

  import type { Node } from "$lib/builder/builder.js";

  import { getBuilderContext } from "./context.svelte.js";

  interface Props {
    children: Snippet;
    node: Node;
  }

  const { children, node }: Props = $props();

  const ctx = getBuilderContext();
  const nodeAccessor = () => node;
  const selectNode = (e: Event) => {
    e.stopPropagation();
    ctx.selectedNode = nodeAccessor;
  };

  const selectedNode = $derived(ctx.selectedNode());
</script>

<div
  role="button"
  tabindex="0"
  onkeydown={(e) => {
    if (e.key === "Enter" || e.key === " ") {
      selectNode(e);
    }
  }}
  onclick={selectNode}
  class={[
    "border rounded p-2 flex flex-col gap-2",
    selectedNode?.id === node.id ? "bg-primary/5" : "bg-background",
  ]}
>
  {@render children()}
</div>

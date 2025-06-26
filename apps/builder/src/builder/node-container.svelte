<script lang="ts">
  import type { Node } from "$lib/builder/builder.js";

  import { getBuilderContext } from "./context.svelte.js";
  import type { HTMLAttributes } from "svelte/elements";

  interface Props extends HTMLAttributes<HTMLDivElement> {
    node: Node;
  }

  const { children, node, ...rest }: Props = $props();

  const ctx = getBuilderContext();
  const nodeAccessor = () => node;
  const selectNode = (e: Event) => {
    e.stopPropagation();
    ctx.selectNode(nodeAccessor);
  };
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
    "border rounded p-2 flex flex-col gap-1",
    ctx.selectedNode?.id === node.id ? "bg-primary/5" : "bg-background",
  ]}
  {...rest}
>
  {@render children?.()}
</div>

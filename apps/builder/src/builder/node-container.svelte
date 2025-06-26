<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements";

  import type { Node } from "$lib/builder/builder.js";

  import { getBuilderContext } from "./context.svelte.js";

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
    "rounded p-2 flex-1 flex flex-col gap-1 border bg-background",
    ctx.selectedNode?.id === node.id ? "border-primary" : "",
  ]}
  {...rest}
>
  {@render children?.()}
</div>

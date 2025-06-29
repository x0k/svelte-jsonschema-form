<script lang="ts">
  import type { Node } from "$lib/builder/index.js";

  import { getBuilderContext, getNodeContext } from "./context.svelte.js";
  import DropIndicator from "./drop-indicator.svelte";

  interface Props {
    onDrop: (node: Node) => void;
  }

  const { onDrop }: Props = $props();

  const ctx = getBuilderContext();
  const nodeCtx = getNodeContext();

  const droppable = ctx.createNodeDroppable(nodeCtx, {
    onDrop,
  });
</script>

<DropIndicator {droppable} />

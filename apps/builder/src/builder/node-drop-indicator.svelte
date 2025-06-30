<script lang="ts">
  import type { SelectableNode } from "$lib/builder/index.js";

  import { getBuilderContext, getNodeContext, selectableNode } from "./context.svelte.js";
  import DropIndicator from "./drop-indicator.svelte";

  interface Props {
    onDrop: (node: SelectableNode) => void;
  }

  const { onDrop }: Props = $props();

  const ctx = getBuilderContext();
  const nodeCtx = getNodeContext();

  const droppable = ctx.createDroppable(nodeCtx, {
    accept: selectableNode,
    onDrop,
  });
</script>

<DropIndicator {droppable} />

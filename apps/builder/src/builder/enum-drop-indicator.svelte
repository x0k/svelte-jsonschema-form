<script lang="ts">
  import type { EnumItemNode } from "$lib/builder/builder.js";

  import { getBuilderContext, getNodeContext, onlyEnumItemNode } from "./context.svelte.js";
  import DropIndicator from "./drop-indicator.svelte";

  interface Props {
    onDrop: (item: EnumItemNode) => void;
  }

  const { onDrop }: Props = $props();

  const ctx = getBuilderContext();
  const nodeCtx = getNodeContext();

  const droppable = ctx.createDroppable(nodeCtx, {
    accept: onlyEnumItemNode,
    onDrop,
  });
</script>

<DropIndicator {droppable} />

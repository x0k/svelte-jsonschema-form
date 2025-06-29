<script lang="ts">
  import type { EnumItem } from "$lib/builder/builder.js";

  import { getBuilderContext } from "./context.svelte.js";
  import DropIndicator from "./drop-indicator.svelte";

  interface Props {
    onDrop: (item: EnumItem) => void;
  }

  const { onDrop }: Props = $props();

  const ctx = getBuilderContext();

  const droppable = ctx.createEnumItemDroppable({
    onDrop,
  });
</script>

<DropIndicator {droppable} />

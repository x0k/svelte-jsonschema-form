<script lang="ts">
  import GripVertical from "@lucide/svelte/icons/grip-vertical";
  import Trash from "@lucide/svelte/icons/trash-2";

  import type { EnumItem } from "$lib/builder/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import { Input } from "$lib/components/ui/input/index.js";

  import { getBuilderContext } from "./context.svelte.js";

  interface Props {
    item: EnumItem;
    toValue: (v: string) => string;
    unmount: () => void;
  }

  let { item = $bindable(), toValue, unmount }: Props = $props();

  const ctx = getBuilderContext();

  let itemSnapshot: EnumItem;
  const draggable = ctx.createDraggableEnumItem({
    beforeDrop() {
      itemSnapshot = $state.snapshot(item);
      unmount();
    },
    get item() {
      return itemSnapshot;
    },
  });
</script>

<div
  class="grid grid-cols-[auto_1fr_1fr_auto] gap-2 items-center"
  {@attach draggable.attach}
>
  <div class="cursor-grab" {@attach draggable.attachHandle}>
    <GripVertical class="size-5" />
  </div>
  <Input
    placeholder="Label"
    bind:value={
      () => item.label,
      (v) => {
        if (toValue(item.label) === item.value) {
          item.value = toValue(v);
        }
        item.label = v;
      }
    }
  />
  <Input placeholder="Value" bind:value={item.value} />
  <Button variant="outline" size="icon" class="size-8" onclick={unmount}>
    <Trash />
  </Button>
</div>

<script lang="ts">
  import GripVertical from "@lucide/svelte/icons/grip-vertical";

  import type { NodeType } from "$lib/builder/index.js";
  import { Input } from "$lib/components/ui/input/index.js";

  import type { NodeProps } from "../../model.js";
  import RemoveButton from "../../remove-button.svelte";
  import Container from "../../container.svelte";

  let {
    node = $bindable(),
    draggable,
    unmount,
    toValue,
  }: NodeProps<NodeType.EnumItem> & {
    toValue: (v: string) => string;
  } = $props();
</script>

<Container
  builderDraggable={draggable}
  class="grid grid-cols-[auto_1fr_1fr_auto] gap-2 items-center"
>
  <div class="cursor-grab" {@attach draggable.attachHandle}>
    <GripVertical class="size-5" />
  </div>
  <Input
    placeholder="Label"
    bind:value={
      () => node.label,
      (v) => {
        if (toValue(node.label) === node.value) {
          node.value = toValue(v);
        }
        node.label = v;
      }
    }
  />
  <Input placeholder="Value" bind:value={node.value} />
  <RemoveButton onClick={unmount} />
</Container>

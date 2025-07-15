<script lang="ts">
  import GripVertical from "@lucide/svelte/icons/grip-vertical";

  import type { NodeType } from "$lib/builder/index.js";
  import { Input } from "$lib/components/ui/input/index.js";

  import type { NodeProps } from "../../model.js";
  import RemoveButton from "../../remove-button.svelte";
  import NodeContainer from "../../node-container.svelte";
  import NodeIssues from '../../node-issues.svelte';

  let {
    node = $bindable(),
    draggable,
    unmount,
    toValue,
  }: NodeProps<NodeType.EnumItem> & {
    toValue: (v: string) => string;
  } = $props();
</script>

<NodeContainer
  bind:node
  {draggable}
  class="grid grid-cols-[auto_1fr_1fr_auto] gap-2 items-center"
  disableSelection
  showRequired={false}
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
  <NodeIssues class="col-span-4" {node} />
</NodeContainer>

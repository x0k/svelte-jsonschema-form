<script lang="ts">
  import type { NodeType } from "$lib/builder/builder.js";

  import type { NodeProps } from "../../../model.js";

  let {
    node = $bindable(),
    draggable,
    unmount,
  }: NodeProps<NodeType.Operator> = $props();
</script>

Operator

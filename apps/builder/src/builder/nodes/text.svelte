<script lang="ts">
  import type { NodeType } from "$lib/builder/builder.js";

  import type { NodeProps } from "../model.js";
  import NodeHeader from "../node-header.svelte";

  let { node = $bindable(), unmount }: NodeProps<NodeType.String> = $props();
</script>

<div class="border rounded p-2 flex flex-col gap-2">
  <NodeHeader {node} {unmount} />
</div>

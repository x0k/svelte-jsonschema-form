<script lang="ts">
  import { NodeType } from "$lib/builder/index.js";

  import { NODES } from "./nodes/index.js";
  import type { NodeProps } from "./model.js";

  let { node = $bindable(), unmount }: NodeProps<NodeType> = $props();

  const NodeComponent = $derived(NODES[node.type]);
</script>

<NodeComponent node={node as never} {unmount} />

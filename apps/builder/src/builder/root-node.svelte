<script lang="ts">
  import { NodeType } from "$lib/builder/index.js";

  import { NODES } from "./nodes/index.js";
  import type { NodeProps } from "./model.js";
  import NodeContainer from "./node-container.svelte";
  import NodeHeader from "./node-header.svelte";

  let {
    node = $bindable(),
    unmount,
  }: NodeProps<NodeType> & {
    unmount: () => void;
  } = $props();

  const NodeComponent = $derived(NODES[node.type]);
</script>

<NodeContainer {node}>
  <NodeHeader {node} {unmount} />
  <NodeComponent bind:node={node as never} />
</NodeContainer>

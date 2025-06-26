<script lang="ts">
  import type { Node } from "$lib/builder/index.js";

  import { NODES } from "./nodes/index.js";
  import NodeContainer from "./node-container.svelte";
  import NodeHeader from "./node-header.svelte";

  interface Props {
    node: Node;
    unmount: () => void;
  }

  let { node = $bindable(), unmount }: Props = $props();

  const NodeComponent = NODES[node.type];
</script>

<NodeContainer {node}>
  <NodeHeader {node} {unmount} />
  <NodeComponent bind:node={node as never} />
</NodeContainer>

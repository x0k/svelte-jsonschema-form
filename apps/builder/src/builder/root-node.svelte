<script lang="ts">
  import type { NodeId } from "$lib/builder/index.js";

  import { NODES } from "./nodes/index.js";
  import NodeContainer from "./node-container.svelte";
  import NodeHeader from "./node-header.svelte";
  import { getBuilderContext } from "./context.svelte.js";

  interface Props {
    nodeId: NodeId;
    unmount: () => void;
  }

  let { nodeId, unmount }: Props = $props();

  const ctx = getBuilderContext();

  const node = $derived(ctx.getNodeById(nodeId));
</script>

{#if node}
  {@const NodeComponent = NODES[node.type]}
  <NodeContainer {node}>
    <NodeHeader {node} {unmount} />
    <NodeComponent node={node as never} />
  </NodeContainer>
{/if}

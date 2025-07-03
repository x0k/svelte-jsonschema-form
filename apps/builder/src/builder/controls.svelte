<script>
  import {
    createNode,
    createOperatorNode,
    CUSTOMIZABLE_TYPE_TITLES,
    CUSTOMIZABLE_TYPES,
    NodeType,
    OPERATOR_TITLES,
    OPERATOR_TYPES,
  } from "$lib/builder/index.js";

  import { getBuilderContext } from "./context.svelte.js";
  import NodeFactory from "./node-factory.svelte";

  const ctx = getBuilderContext();
  const entries = $derived(
    ctx.selectedNode?.type === NodeType.Predicate
      ? OPERATOR_TYPES.map((t) => ({
          id: `op::${t}`,
          factory: () => createOperatorNode(t),
          title: OPERATOR_TITLES[t],
        }))
      : CUSTOMIZABLE_TYPES.map((t) => ({
          id: `node::${t}`,
          factory: () => createNode(t),
          title: CUSTOMIZABLE_TYPE_TITLES[t],
        }))
  );
</script>

<div class="flex flex-col gap-2">
  {#each entries as { id, factory, title } (id)}
    <NodeFactory createNode={factory} {title} />
  {/each}
</div>

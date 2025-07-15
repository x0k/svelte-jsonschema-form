<script>
  import {
    createNode,
    createOperatorNode,
    CUSTOMIZABLE_TYPE_TITLES,
    detectApplicableOperators,
    NodeType,
    OPERATOR_TITLES,
    OPERATOR_TYPES,
  } from "$lib/builder/index.js";

  import { getBuilderContext } from "../context.svelte.js";
  import NodeFactory from "../node-factory.svelte";

  const ctx = getBuilderContext();
  const entries = $derived.by(() => {
    if (ctx.selectedNode?.type === NodeType.Predicate) {
      // NOTE: Affected node should be always defined
      const ops = detectApplicableOperators(
        ctx.affectedNode ?? ctx.selectedNode
      );
      return OPERATOR_TYPES.filter((t) => ops.has(t)).map((t) => ({
        id: `op::${t}`,
        factory: () => createOperatorNode(t),
        title: OPERATOR_TITLES[t],
      }));
    }
    return ctx.availableCustomizableNodeTypes.map((t) => ({
      id: `node::${t}`,
      factory: () => createNode(t),
      title: CUSTOMIZABLE_TYPE_TITLES[t],
    }));
  });
</script>

<div class="flex flex-col gap-2">
  {#each entries as { id, factory, title } (id)}
    <NodeFactory createNode={factory} {title} />
  {/each}
</div>

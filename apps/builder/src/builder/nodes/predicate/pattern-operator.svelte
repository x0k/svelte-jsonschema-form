<script lang="ts">
  import type { OperatorNode } from "$lib/builder/node.js";
  import type {
    AbstractOperator,
    OperatorType,
  } from "$lib/builder/operator.js";
  import { Input } from "$lib/components/ui/input/index.js";

  interface Props {
    node: Extract<OperatorNode, AbstractOperator<OperatorType.Pattern>>;
  }

  let { node = $bindable() }: Props = $props();
</script>

<Input placeholder="Value" bind:value={node.value} />

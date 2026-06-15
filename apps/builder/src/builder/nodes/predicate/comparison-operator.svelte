<script lang="ts">
  import type { ComparisonOperator } from "$lib/builder/node.js";
  import { Input } from "$lib/components/ui/input/index.js";

  interface Props {
    node: ComparisonOperator;
  }

  let { node = $bindable() }: Props = $props();
</script>

<Input
  placeholder="Value"
  bind:value={() => node.value, (v) => (node.value = v ?? undefined)}
/>

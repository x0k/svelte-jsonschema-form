<script lang="ts">
  import type { EqOperator } from "$lib/builder/index.js";
  import { Input } from "$lib/components/ui/input/index.js";

  interface Props {
    node: EqOperator;
  }

  let { node = $bindable() }: Props = $props();
</script>

<Input placeholder="Value" bind:value={node.value} />

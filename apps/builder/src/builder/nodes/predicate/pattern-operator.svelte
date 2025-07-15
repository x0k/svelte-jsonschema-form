<script lang="ts">
  import type { SOperator } from "$lib/builder/index.js";
  import { Input } from "$lib/components/ui/input/index.js";

  interface Props {
    node: SOperator
  }

  let { node = $bindable() }: Props = $props();
</script>

<Input placeholder="Value" bind:value={node.value} />

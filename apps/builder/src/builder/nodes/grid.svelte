<script lang="ts">
  import type { NodeType } from "$lib/builder/builder.js";

  import type { NodeProps } from "../model.js";

  let { node = $bindable() }: NodeProps<NodeType.Grid> = $props();
</script>

Grid

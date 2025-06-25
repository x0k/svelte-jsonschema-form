<script lang="ts">
  import type { NodeType } from "$lib/builder/builder.js";

  import type { NodeProps } from "../model.js";
  import MultiDropZone from "../multi-drop-zone.svelte";

  let { node = $bindable() }: NodeProps<NodeType.Object> = $props();
</script>

<MultiDropZone bind:nodes={node.children} />

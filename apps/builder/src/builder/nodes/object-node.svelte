<script lang="ts">
  import type { ObjectNode } from "@/lib/builder/builder.js";

  interface Props {
    node: ObjectNode;
  }

  let { node = $bindable() }: Props = $props();
</script>

Object {node.type}

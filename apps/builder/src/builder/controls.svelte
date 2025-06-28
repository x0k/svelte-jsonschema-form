<script>
  import { NodeType } from "$lib/builder/index.js";

  import NodeFactory from "./node-factory.svelte";
</script>

<div class="flex flex-col gap-2">
  <NodeFactory nodeType={NodeType.Object} title="Group" />
  <NodeFactory nodeType={NodeType.Grid} title="Grid" />
  <NodeFactory nodeType={NodeType.Enum} title="Enum" />
  <NodeFactory nodeType={NodeType.String} title="String" />
</div>

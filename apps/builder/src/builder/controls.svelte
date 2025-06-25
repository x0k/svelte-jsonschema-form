<script>
  import { NodeType } from "$lib/builder/builder.js";

  import NodeFactory from "./node-factory.svelte";
</script>

<div class="flex flex-col gap-2">
  <p>Containers</p>
  <NodeFactory nodeType={NodeType.Object} title="Group" />
  <NodeFactory nodeType={NodeType.Grid} title="Grid" />
  <p>Fields</p>
  <NodeFactory nodeType={NodeType.String} title="String" />
</div>

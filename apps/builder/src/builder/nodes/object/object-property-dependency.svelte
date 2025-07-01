<script lang="ts">
  import type { NodeType } from "$lib/builder/builder.js";

  import type { NodeProps } from "../../model.js";
  import Header from "../../header.svelte";
  import Container from "../../container.svelte";

  let {
    node = $bindable(),
    draggable,
    unmount,
  }: NodeProps<NodeType.ObjectPropertyDependency> & {} = $props();
</script>

<Container builderDraggable={draggable}>
  <Header {draggable} {unmount} disablePadding>Dependency</Header>
</Container>

<script lang="ts">
  import {
    type CustomizableNode,
    type NodeType,
    type ObjectPropertyNode,
  } from "$lib/builder/index.js";
  import { Checkbox } from "$lib/components/ui/checkbox/index.js";
  import { Label } from "$lib/components/ui/label/index.js";

  import type { NodeProps } from "../../model.js";
  import Header from "../../header.svelte";
  import NodeContainer from "../../node-container.svelte";
  import MultiDropZone from "../../multi-drop-zone.svelte";
  import {
    getBuilderContext,
    isCustomizableOrPropertyNode,
  } from "../../context.svelte.js";

  let {
    node = $bindable(),
    draggable,
    unmount,
  }: NodeProps<NodeType.ObjectPropertyDependency> & {} = $props();

  const ctx = getBuilderContext();

  const onDrop = (
    newNode: CustomizableNode | ObjectPropertyNode,
    index: number
  ) => {
    node.properties.splice(index, 0, newNode);
    ctx.selectNode({
      current() {
        return node.properties.find((n) => n.id === newNode.id);
      },
      update(newNode) {
        const idx = node.properties.findIndex((n) => n.id === newNode.id);
        node.properties[idx] = newNode;
      },
    });
  };
</script>

<NodeContainer bind:node {draggable}>
  <Header {draggable} {unmount} disablePadding>
    Dependency
    {#snippet append()}
      <div class="flex items-center gap-2">
        <Checkbox id="terms" />
        <Label for="terms">Complementary</Label>
      </div>
    {/snippet}
  </Header>
  <MultiDropZone
    bind:nodes={node.properties}
    accept={isCustomizableOrPropertyNode}
    {onDrop}
  />
</NodeContainer>

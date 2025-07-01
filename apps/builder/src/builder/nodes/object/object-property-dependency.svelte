<script lang="ts">
  import Info from "@lucide/svelte/icons/info";

  import {
    type CustomizableNode,
    type NodeType,
    type ObjectPropertyNode,
  } from "$lib/builder/index.js";
  import { Checkbox } from "$lib/components/ui/checkbox/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
  import * as Tooltip from "$lib/components/ui/tooltip/index.js";

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
    complementary = $bindable(),
    draggable,
    unmount,
  }: NodeProps<NodeType.ObjectPropertyDependency> & {
    complementary: boolean;
  } = $props();

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
        <Label class="text-muted-foreground">
          <Checkbox bind:checked={complementary} />
          Complementary
          <Tooltip.Root>
            <Tooltip.Trigger>
              <Info class="size-5" />
            </Tooltip.Trigger>
            <Tooltip.Content>
              <p>
                Field values must be split between predicates without overlaps
                or gaps.
              </p>
              <p>
                Mark a predicate as <code>Complementary</code> to include all remaining
                values.
              </p>
            </Tooltip.Content>
          </Tooltip.Root>
        </Label>
      </div>
    {/snippet}
  </Header>
  <MultiDropZone
    bind:nodes={node.properties}
    accept={isCustomizableOrPropertyNode}
    {onDrop}
  />
</NodeContainer>

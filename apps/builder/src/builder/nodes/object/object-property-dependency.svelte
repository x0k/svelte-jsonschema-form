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
  import {
    getBuilderContext,
    getNodeContext,
    isCustomizableOrPropertyNode,
  } from "../../context.svelte.js";
  import Header from "../../header.svelte";
  import NodeContainer from "../../node-container.svelte";
  import MultiDropZone from "../../multi-dropzone.svelte";

  import PredicateDropZone from "./predicate-drop-zone.svelte";

  let {
    node = $bindable(),
    complementary = $bindable(),
    draggable,
    unmount,
    index,
  }: NodeProps<NodeType.ObjectPropertyDependency> & {
    index: number;
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
    Branch {index + 1}
    {#snippet append()}
      <div class="flex items-center gap-2">
        <Label
          class="text-muted-foreground text-base"
          onclick={(e) => e.stopPropagation()}
        >
          <Checkbox bind:checked={complementary} />
          Complement
          <Tooltip.Root>
            <Tooltip.Trigger>
              <Info class="size-5" />
            </Tooltip.Trigger>
            <Tooltip.Content>
              <p>Field values must be split between branches without gaps.</p>
              <p>
                Mark a branch as <code>Complement</code> to include all remaining
                values.
              </p>
            </Tooltip.Content>
          </Tooltip.Root>
        </Label>
      </div>
    {/snippet}
  </Header>
  {#if !complementary}
    <div class="pb-2">
      <PredicateDropZone bind:node />
    </div>
  {/if}
  <MultiDropZone
    bind:nodes={node.properties}
    accept={isCustomizableOrPropertyNode}
    {onDrop}
  />
</NodeContainer>

<script lang="ts">
  import Info from "@lucide/svelte/icons/info";

  import {
    createPredicate,
    type CustomizableNode,
    type NodeType,
    type ObjectPropertyNode,
  } from "$lib/builder/index.js";
  import { Checkbox } from "$lib/components/ui/checkbox/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import * as Tooltip from "$lib/components/ui/tooltip/index.js";

  import type { NodeProps } from "../../model.js";
  import {
    getBuilderContext,
    getNodeContext,
    isCustomizableOrPropertyNode,
    isPredicateNode,
  } from "../../context.svelte.js";
  import Header from "../../header.svelte";
  import NodeContainer from "../../node-container.svelte";
  import MultiDropZone from "../../multi-drop-zone.svelte";
  import DropZone from "../../drop-zone.svelte";
  import { PredicateNode } from "./predicate/index.js";

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
  const nodeCtx = getNodeContext();

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
    {@const droppable = ctx.createDroppable(nodeCtx, {
      accept: isPredicateNode,
      onDrop(n) {
        node.predicate = n;
      },
    })}
    <div class="pb-4">
      {#if node.predicate}
        {@const unmount = () => {
          node.predicate = undefined;
        }}
        {@const draggable = ctx.createDraggable({
          unmount,
          get node() {
            return node.predicate!;
          },
        })}
        <PredicateNode {draggable} bind:node={node.predicate} {unmount} />
      {:else}
        <DropZone {droppable}>
          {#snippet placeholder()}
            Drop predicate here or <Button
              onclick={(e) => {
                e.stopPropagation();
                node.predicate = createPredicate();
              }}>Create one</Button
            >
          {/snippet}
        </DropZone>
      {/if}
    </div>
  {/if}
  <MultiDropZone
    bind:nodes={node.properties}
    accept={isCustomizableOrPropertyNode}
    {onDrop}
  />
</NodeContainer>

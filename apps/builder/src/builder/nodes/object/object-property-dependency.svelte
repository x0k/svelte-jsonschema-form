<script lang="ts">
  import Info from "@lucide/svelte/icons/info";

  import {
    type CustomizableNode,
    type NodeType,
    type ObjectPropertyNode,
    createObjectProperty,
    isCustomizableOrPropertyNode,
    isObjectPropertyNode,
  } from "$lib/builder/index.js";
  import { Checkbox } from "$lib/components/ui/checkbox/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
  import * as Tooltip from "$lib/components/ui/tooltip/index.js";

  import type { NodeProps } from "../../model.js";
  import { getBuilderContext } from "../../context.svelte.js";
  import { getIndexContext } from "../../index.svelte";
  import NodeHeader from "../../node-header.svelte";
  import NodeContainer from "../../node-container.svelte";
  import MultiDropZone from "../../multi-dropzone.svelte";
  import NodeIssues from "../../node-issues.svelte";

  import { PredicateDropzone } from "../predicate/index.js";
  import { getObjectContext } from "./context.js";

  let {
    node = $bindable(),
    draggable,
    unmount,
  }: NodeProps<NodeType.ObjectPropertyDependency> = $props();

  const ctx = getBuilderContext();
  const objCtx = getObjectContext();
  const indexCtx = getIndexContext();

  const onDrop = (
    newNode: CustomizableNode | ObjectPropertyNode,
    index: number
  ) => {
    const prop = isObjectPropertyNode(newNode)
      ? newNode
      : createObjectProperty(newNode);
    node.properties.splice(index, 0, prop);
    ctx.selectNode(
      {
        current() {
          return node.properties.find((n) => n.id === prop.id)?.property;
        },
        update(newNode) {
          const idx = node.properties.findIndex((n) => n.id === prop.id);
          node.properties[idx].property = newNode;
        },
      },
      false
    );
  };

  const complementary = $derived(objCtx.complementary === node.id);

  const checkboxId = $props.id();
</script>

<NodeContainer
  bind:node
  {draggable}
  showRequired={false}
  class="flex flex-col gap-0.5"
>
  <NodeHeader
    {draggable}
    unmount={() => {
      objCtx.complementary = undefined;
      unmount();
    }}
    disablePadding
  >
    Branch {indexCtx.current + 1}
    {#snippet append()}
      <div class="flex items-center gap-2">
        <Checkbox
          id={checkboxId}
          onclick={(e) => e.stopPropagation()}
          bind:checked={
            () => complementary,
            (v) => {
              objCtx.complementary = v ? node.id : undefined;
            }
          }
        />
        <Label
          for={checkboxId}
          class="text-muted-foreground text-base"
          onclick={(e) => e.stopPropagation()}
        >
          Complement
        </Label>
        <Tooltip.Root>
          <Tooltip.Trigger>
            <Info class="size-5 text-muted-foreground" />
          </Tooltip.Trigger>
          <Tooltip.Content>
            <p>Field values must be split between branches without gaps.</p>
            <p>
              Mark a branch as <code>Complement</code> to include all remaining values.
            </p>
          </Tooltip.Content>
        </Tooltip.Root>
      </div>
    {/snippet}
  </NodeHeader>
  {#if !complementary}
    <div class="pb-2">
      <PredicateDropzone bind:node />
    </div>
  {/if}
  <MultiDropZone
    showRequired={false}
    bind:nodes={node.properties}
    accept={isCustomizableOrPropertyNode}
    {onDrop}
  />
  <NodeIssues class={[node.properties.length === 0 && "pt-4"]} {node} />
</NodeContainer>

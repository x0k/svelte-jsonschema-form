<script lang="ts">
  import {
    createObjectPropertyDependency,
    type NodeType,
  } from "$lib/builder/index.js";
  import { Button } from "$lib/components/ui/button/index.js";

  import type { NodeProps } from "../../model.js";
  import {
    getBuilderContext,
    isObjectPropertyDependencyNode,
  } from "../../context.svelte.js";
  import Container from "../../container.svelte";
  import DropIndicator from "../../drop-indicator.svelte";
  import { NODES } from "../index.js";

  import ObjectPropertyDependency from "./object-property-dependency.svelte";

  let {
    draggable,
    node = $bindable(),
    unmount,
  }: NodeProps<NodeType.ObjectProperty> = $props();

  const Property = $derived(NODES[node.property.type]);

  const ctx = getBuilderContext();
  const isSelected = $derived(ctx.selectedNode?.id === node.property.id);
  const hasDeps = $derived(node.dependencies.length > 0);

  function pushDependency(e: Event) {
    e.stopPropagation();
    node.dependencies.push(createObjectPropertyDependency());
  }
</script>

<Container
  {draggable}
  bind:node={node.property}
  class={[
    "p-0 border-none relative bg-border flex flex-col gap-1",
    isSelected && "shadow-[inset_0_0_0_1px_var(--primary)]",
  ]}
>
  <Button
    class={[
      "absolute -bottom-10 left-1/2 -translate-x-1/2 z-10",
      isSelected && !hasDeps && !draggable.isDragged ? "inline-flex" : "hidden",
    ]}
    onclick={pushDependency}>Add dependency</Button
  >
  <Property bind:node={node.property as never} {unmount} {draggable} />
  {#if hasDeps}
    <div class="flex flex-col gap-0.5 px-2 pb-4">
      {#each node.dependencies as dep, i (dep.id)}
        {@const unmount = () => {
          node.dependencies.splice(i, 1);
        }}
        {@const draggable = ctx.createDraggable({
          unmount,
          get node() {
            return node.dependencies[i];
          },
        })}
        <DropIndicator
          accept={isObjectPropertyDependencyNode}
          onDrop={(n) => {
            node.dependencies.splice(i, 0, n);
          }}
        />
        <ObjectPropertyDependency
          bind:node={node.dependencies[i]}
          {unmount}
          {draggable}
        />
      {/each}
      <DropIndicator
        accept={isObjectPropertyDependencyNode}
        onDrop={(n) => {
          node.dependencies.push(n);
        }}
      />
      <Button onclick={pushDependency}>Add dependency</Button>
    </div>
  {/if}
</Container>

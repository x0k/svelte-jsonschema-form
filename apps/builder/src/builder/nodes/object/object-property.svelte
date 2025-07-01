<script lang="ts">
  import {
    createObjectPropertyDependency,
    type NodeType,
  } from "$lib/builder/builder.js";
  import { Button } from "$lib/components/ui/button/index.js";

  import { getBuilderContext, type NodeRef } from "../../context.svelte.js";
  import type { NodeProps } from "../../model.js";
  import { NODES } from "../index.js";

  import ObjectPropertyDependency from "./object-property-dependency.svelte";

  let {
    draggable,
    node = $bindable(),
    unmount,
  }: NodeProps<NodeType.ObjectProperty> = $props();

  const Property = $derived(NODES[node.property.type]);

  const ctx = getBuilderContext();
  const isReady = $derived(ctx.selectedNode?.id === node.property.id);
  const hasDeps = $derived(node.dependencies.length > 0);

  const nodeRef: NodeRef = {
    current() {
      return node.property;
    },
    update(n) {
      node.property = n;
    },
  };
  function selectNode(e: Event) {
    e.stopPropagation();
    ctx.selectNode(nodeRef);
  }

  function pushDependency(e: Event) {
    e.stopPropagation();
    node.dependencies.push(createObjectPropertyDependency());
  }
</script>

<div
  {@attach draggable.attach}
  class={[
    "relative bg-border rounded-md flex flex-col gap-1",
    isReady && hasDeps && "shadow-[inset_0_0_0_1px_var(--primary)]",
  ]}
  role="button"
  tabindex="0"
  onkeydown={(e) => {
    if (e.code === "Enter" || e.code === "Space") {
      selectNode(e);
    }
  }}
  onclick={selectNode}
>
  <Button
    class={[
      "absolute -bottom-10 left-1/2 -translate-x-1/2 z-10",
      isReady ? "inline-flex" : "hidden",
    ]}
    onclick={pushDependency}>Add dependency</Button
  >
  <Property bind:node={node.property as never} {unmount} {draggable} />
  {#if hasDeps}
    <div class="flex flex-col gap-4 p-4">
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
        <ObjectPropertyDependency
          bind:node={node.dependencies[i]}
          {unmount}
          {draggable}
        />
      {/each}
      <Button onclick={pushDependency}>Add dependency</Button>
    </div>
  {/if}
</div>

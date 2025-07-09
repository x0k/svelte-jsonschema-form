<script lang="ts">
  import {
    createObjectPropertyDependency,
    isObjectPropertyDependencyNode,
    type NodeType,
  } from "$lib/builder/index.js";
  import { Button } from "$lib/components/ui/button/index.js";

  import type { NodeProps } from "../../model.js";
  import { getBuilderContext } from "../../context.svelte.js";
  import NodeContainer from "../../node-container.svelte";
  import MultiDropzone from "../../multi-dropzone.svelte";
  import NodeIssues from "../../node-issues.svelte";

  import { NODES } from "../index.js";

  import { setObjectContext } from "./context.js";
  import { setPredicateContext } from "../predicate/context.js";

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
    const n = createObjectPropertyDependency();
    node.dependencies.push(n);
    node.complementary = n.id;
  }

  setObjectContext({
    get complementary() {
      return node.complementary;
    },
    set complementary(v) {
      node.complementary = v;
    },
  });
  setPredicateContext({
    get node() {
      return node.property;
    },
  });
  const isError = $derived(ctx.errors[node.id] !== undefined);
  const isWarning = $derived(ctx.warnings[node.id] !== undefined);
</script>

<NodeContainer
  {draggable}
  bind:node={node.property}
  class={[
    "p-0 border-none relative bg-border flex flex-col gap-1",
    isError
      ? "shadow-[inset_0_0_0_1px_var(--destructive)]"
      : isWarning
        ? "shadow-[inset_0_0_0_1px_var(--chart-3)]"
        : isSelected && "shadow-[inset_0_0_0_1px_var(--primary)]",
  ]}
  showRequired
>
  <Button
    class={[
      "absolute -bottom-11 left-1/2 -translate-x-1/2 z-20",
      isSelected && !hasDeps && !ctx.isDragged ? "inline-flex" : "hidden",
    ]}
    onclick={pushDependency}>Add dependency</Button
  >
  <Property
    showRequired
    bind:node={node.property as never}
    {unmount}
    {draggable}
  />
  {#if hasDeps}
    <div class="flex flex-col gap-0.5 px-2 pb-4">
      <MultiDropzone
        showRequired={false}
        bind:nodes={node.dependencies}
        accept={isObjectPropertyDependencyNode}
        onDrop={(newNode, i) => {
          node.dependencies.splice(i, 0, newNode);
        }}
      />
      <Button onclick={pushDependency}>Add dependency</Button>
    </div>
  {/if}
  <NodeIssues class="pb-4" {node} />
</NodeContainer>

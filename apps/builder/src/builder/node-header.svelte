<script lang="ts">
  import type { Snippet } from "svelte";

  import type { CustomizableNodeType } from "$lib/builder/index.js";

  import type { NodeProps } from "./model.js";
  import type { BuilderDraggable } from "./context.svelte.js";
  import Header from "./header.svelte";

  const {
    node,
    draggable,
    unmount,
    append,
    disablePadding,
    showRequired,
  }: NodeProps<CustomizableNodeType> & {
    draggable: BuilderDraggable;
    disablePadding?: boolean;
    append?: Snippet;
  } = $props();
</script>

<Header {draggable} {unmount} {disablePadding} {append}>
  {node.options.title}
  {#if showRequired && node.options.required}
    <span>*</span>
  {/if}
</Header>

<script lang="ts">
  import type { Snippet } from "svelte";

  import type { CustomizableNodeType } from "$lib/builder/index.js";
  import type { WidgetType } from '$lib/sjsf/theme.js';

  import { type NodeProps, WIDGET_NAMES } from "./model.js";
  import type { BuilderDraggable } from "./context.svelte.js";
  import NodeHeader from "./node-header.svelte";

  const {
    node,
    draggable,
    unmount,
    disablePadding,
    showRequired,
    append = defaultAppend,
  }: NodeProps<CustomizableNodeType> & {
    draggable: BuilderDraggable;
    disablePadding?: boolean;
    append?: Snippet;
  } = $props();
</script>

{#snippet defaultAppend()}
  {#if "widget" in node.options}
    <span class="text-muted-foreground"
      >{WIDGET_NAMES[node.options.widget as WidgetType]}</span
    >
  {/if}
{/snippet}
<NodeHeader {draggable} {unmount} {disablePadding} {append}>
  {node.options.title}
  {#if showRequired && node.options.required}
    <span>*</span>
  {/if}
</NodeHeader>

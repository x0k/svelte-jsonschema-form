<script lang="ts">
  import type { Snippet } from "svelte";

  import type { Node } from "$lib/builder/index.js";

  import type { BuilderDraggable } from "./context.svelte.js";
  import Container from "./container.svelte";

  interface Props {
    node: Node;
    draggable: BuilderDraggable;
    children: Snippet;
    showRequired: boolean
  }

  let { children, node = $bindable(), draggable, showRequired }: Props = $props();
</script>

<Container
  bind:node
  {children}
  {draggable}
  {showRequired}
  class="flex-1 flex flex-col gap-0.5"
/>

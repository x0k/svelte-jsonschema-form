<script lang="ts">
  import type { Snippet } from "svelte";

  import type { Node } from "$lib/builder/index.js";

  import type { BuilderDraggable } from "./context.svelte.js";
  import Container from "./container.svelte";

  interface Props {
    node: Node;
    draggable: BuilderDraggable;
    children: Snippet;
  }

  let { children, node = $bindable(), draggable }: Props = $props();
</script>

<Container
  bind:node
  {children}
  {draggable}
  class="flex-1 flex flex-col gap-0.5"
/>

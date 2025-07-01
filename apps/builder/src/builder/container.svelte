<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements";

  import type { BuilderDraggable } from "./context.svelte.js";

  interface Props extends HTMLAttributes<HTMLDivElement> {
    builderDraggable: BuilderDraggable;
  }

  const {
    class: className,
    builderDraggable,
    children,
    ...rest
  }: Props = $props();
</script>

<div
  {@attach builderDraggable.attach}
  class={[
    "rounded-md p-2 border bg-background",
    builderDraggable.isDragged && "opacity-70",
    className,
  ]}
  {...rest}
>
  {@render children?.()}
</div>

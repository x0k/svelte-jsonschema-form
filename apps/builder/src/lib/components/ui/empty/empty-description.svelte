<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements";

  import { cn, type WithElementRef } from "$lib/utils.js";

  let {
    ref = $bindable(null),
    class: className,
    children,
    ...restProps
  }: WithElementRef<HTMLAttributes<HTMLDivElement>> = $props();
</script>

<div
  bind:this={ref}
  data-slot="empty-description"
  class={cn(
    "text-muted-foreground [&>a:hover]:text-primary text-sm/relaxed text-sm/relaxed [&>a]:underline [&>a]:underline-offset-4",
    className
  )}
  {...restProps}
>
  {@render children?.()}
</div>

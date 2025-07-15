<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements";

  import { cn } from "$lib/utils.js";

  const {
    children,
    class: className,
    ...rest
  }: HTMLAttributes<HTMLDivElement> = $props();
</script>

<div
  class={cn("rounded-md p-2 border bg-background w-full", className)}
  {...rest}
>
  {@render children?.()}
</div>

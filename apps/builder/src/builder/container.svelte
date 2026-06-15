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
  class={cn("bg-background w-full rounded-md border p-2", className)}
  {...rest}
>
  {@render children?.()}
</div>

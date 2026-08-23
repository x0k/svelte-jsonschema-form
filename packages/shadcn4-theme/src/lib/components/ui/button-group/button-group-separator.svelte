<script lang="ts">
  import type { ComponentProps } from "svelte";

  import { cn } from "../../../utils.js";
  import { Separator } from "../separator/index.js";

  let {
    ref = $bindable(null),
    class: className,
    orientation = "vertical",
    ...restProps
  }: ComponentProps<typeof Separator> = $props();
</script>

<Separator
  bind:ref
  data-slot="button-group-separator"
  {orientation}
  class={cn(
    "bg-input relative self-stretch data-[orientation=horizontal]:mx-px data-[orientation=horizontal]:w-auto data-[orientation=vertical]:my-px data-[orientation=vertical]:h-auto",
    className
  )}
  {...restProps}
/>

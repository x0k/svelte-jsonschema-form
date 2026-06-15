<script lang="ts">
  import { ToggleGroup as ToggleGroupPrimitive } from "bits-ui";

  import {
    type ToggleVariants,
    toggleVariants,
  } from "$lib/new-york-ui/toggle/index.js";
  import { cn } from "$lib/utils.js";

  import { getToggleGroupCtx } from "./toggle-group.svelte";

  let {
    ref = $bindable(null),
    value = $bindable(),
    class: className,
    size,
    variant,
    ...restProps
  }: ToggleGroupPrimitive.ItemProps & ToggleVariants = $props();

  const ctx = getToggleGroupCtx();
</script>

<ToggleGroupPrimitive.Item
  bind:ref
  class={cn(
    toggleVariants({
      variant: ctx.variant || variant,
      size: ctx.size || size,
    }),
    className
  )}
  {value}
  {...restProps}
/>

<script lang="ts">
  import { ToggleGroup as ToggleGroupPrimitive } from "bits-ui";

  import { cn } from "../../utils.js";
  import { type ToggleVariants, toggleVariants } from "../toggle/index.js";
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

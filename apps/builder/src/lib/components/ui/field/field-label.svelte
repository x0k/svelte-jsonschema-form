<script lang="ts">
  import type { ComponentProps } from "svelte";

  import { Label } from "$lib/components/ui/label/index.js";
  import { cn } from "$lib/utils.js";

  let {
    ref = $bindable(null),
    class: className,
    children,
    ...restProps
  }: ComponentProps<typeof Label> = $props();
</script>

<Label
  bind:ref
  data-slot="field-label"
  class={cn(
    "group/field-label peer/field-label has-data-checked:border-primary/30 has-data-checked:bg-primary/5 dark:has-data-checked:border-primary/20 dark:has-data-checked:bg-primary/10 flex w-fit gap-2 leading-snug group-data-[disabled=true]/field:opacity-50 has-[>[data-slot=field]]:rounded-md has-[>[data-slot=field]]:border *:data-[slot=field]:p-3",
    "has-[>[data-slot=field]]:w-full has-[>[data-slot=field]]:flex-col",
    className
  )}
  {...restProps}
>
  {@render children?.()}
</Label>

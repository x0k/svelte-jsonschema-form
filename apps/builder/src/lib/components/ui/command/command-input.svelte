<script lang="ts">
  import SearchIcon from "@lucide/svelte/icons/search";
  import { Command as CommandPrimitive } from "bits-ui";

  import * as InputGroup from "$lib/components/ui/input-group/index.js";
  import { cn } from "$lib/utils.js";

  let {
    ref = $bindable(null),
    class: className,
    value = $bindable(""),
    ...restProps
  }: CommandPrimitive.InputProps = $props();
</script>

<div data-slot="command-input-wrapper" class="p-1 pb-0">
  <InputGroup.Root
    class="border-input/30 bg-input/30 h-8! rounded-lg! shadow-none! *:data-[slot=input-group-addon]:pl-2!"
  >
    <CommandPrimitive.Input
      data-slot="command-input"
      class={cn(
        "w-full text-sm outline-hidden disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      bind:ref
      {...restProps}
      bind:value
    />
    <InputGroup.Addon>
      <SearchIcon class="size-4 shrink-0 opacity-50" />
    </InputGroup.Addon>
  </InputGroup.Root>
</div>

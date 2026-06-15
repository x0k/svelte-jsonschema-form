<script lang="ts">
  import { Command as CommandPrimitive } from "bits-ui";

  import { cn } from "$lib/utils.js";

  let {
    // eslint-disable-next-line no-useless-assignment
    ref = $bindable(null),
    class: className,
    ...restProps
  }: CommandPrimitive.EmptyProps = $props();
</script>

<CommandPrimitive.Empty
  class={cn("py-6 text-center text-sm", className)}
  {...restProps}
/>

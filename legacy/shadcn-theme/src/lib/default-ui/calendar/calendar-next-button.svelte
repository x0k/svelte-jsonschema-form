<script lang="ts">
  import ChevronRight from "@lucide/svelte/icons/chevron-right";
  import { Calendar as CalendarPrimitive } from "bits-ui";

  import { cn } from "../../utils.js";
  import { buttonVariants } from "../button/index.js";

  let {
    ref = $bindable(null),
    class: className,
    children,
    ...restProps
  }: CalendarPrimitive.PrevButtonProps = $props();
</script>

{#snippet Fallback()}
  <ChevronRight class="size-4" />
{/snippet}

<CalendarPrimitive.NextButton
  bind:ref
  class={cn(
    buttonVariants({ variant: "outline" }),
    "size-7 bg-transparent p-0 opacity-50 hover:opacity-100",
    className
  )}
  children={children || Fallback}
  {...restProps}
/>

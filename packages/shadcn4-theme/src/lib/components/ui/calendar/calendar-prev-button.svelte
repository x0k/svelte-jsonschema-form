<script lang="ts">
  import ChevronLeftIcon from "@lucide/svelte/icons/chevron-left";
  import { Calendar as CalendarPrimitive } from "bits-ui";

  import { cn } from "../../../utils.js";
  import { buttonVariants, type ButtonVariant } from "../button/index.js";

  let {
    ref = $bindable(null),
    class: className,
    children,
    variant = "ghost",
    ...restProps
  }: CalendarPrimitive.PrevButtonProps & {
    variant?: ButtonVariant;
  } = $props();
</script>

{#snippet Fallback()}
  <ChevronLeftIcon class={cn("size-4", className)} />
{/snippet}

<CalendarPrimitive.PrevButton
  bind:ref
  class={cn(
    buttonVariants({ variant }),
    "size-(--cell-size) bg-transparent p-0 select-none disabled:opacity-50 rtl:rotate-180",
    className
  )}
  {...restProps}
>
  {#if children}
    {@render children?.()}
  {:else}
    {@render Fallback()}
  {/if}
</CalendarPrimitive.PrevButton>

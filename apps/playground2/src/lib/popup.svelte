<script lang="ts">
  import type { Snippet } from "svelte";
  import type { ClassValue } from "svelte/elements";

  import { buttonVariants } from "$lib/components/ui/button/button.svelte";
  import * as Popover from "$lib/components/ui/popover/index.js";

  const {
    label,
    children,
    class: className,
  }: { label: Snippet; children: Snippet; class?: ClassValue } = $props();
</script>

<Popover.Root>
  <Popover.Trigger class={buttonVariants({ variant: "outline" })}>
    {@render label()}
  </Popover.Trigger>
  <Popover.Content class={["flex w-max flex-col gap-2", className]}>
    {@render children()}
  </Popover.Content>
</Popover.Root>

<script lang="ts">
  import type { Snippet } from "svelte";
  import * as Popover from "$lib/components/ui/popover/index.js";
  import { buttonVariants } from "./lib/components/ui/button/button.svelte";

  const { label, children }: { label: Snippet; children: Snippet } = $props();
</script>

<Popover.Root>
  <Popover.Trigger class={buttonVariants({ variant: "outline" })}>
    {@render label()}
  </Popover.Trigger>
  <Popover.Content class="flex flex-col gap-2 w-max">
    {@render children()}
  </Popover.Content>
</Popover.Root>

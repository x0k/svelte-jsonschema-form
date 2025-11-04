<script lang="ts">
  import ExternalLink from "@lucide/svelte/icons/external-link";

  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import { Button, buttonVariants } from "$lib/components/ui/button/index.js";
  import type { Sample } from "./core/sample.js";

  interface Props {
    onSelect: (sample: Sample) => void;
  }

  const { onSelect }: Props = $props();

  const samples = import.meta.glob("./samples/*.ts", {
    import: "default",
    eager: false,
  });

  let open = $state.raw(false);
</script>

<Dialog.Root bind:open>
  <Dialog.Trigger class={buttonVariants({ variant: "outline" })}
    >Examples</Dialog.Trigger
  >
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Examples</Dialog.Title>
    </Dialog.Header>
    <div class="flex gap-2 flex-wrap justify-center">
      {#each Object.entries(samples) as [path, loadSample] (path)}
        {@const name = path.substring(10, path.length - 3)}
        <Button variant="secondary" onclick={async () => {
          open = false
          onSelect(await loadSample() as Sample)
        }}>
          {name}
        </Button>
      {/each}
    </div>
    <Dialog.Footer>
      <Button variant="link" href="../examples/advanced/">Advanced examples <ExternalLink tabindex={-1} /> </Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>

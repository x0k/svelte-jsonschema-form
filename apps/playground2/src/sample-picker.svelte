<script lang="ts">
  import * as Command from "$lib/components/ui/command/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
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

<Button variant="outline" onclick={() => (open = true)}>
  <span>Examples</span>
</Button>
<Command.Dialog bind:open>
  <Command.Input placeholder="Search..." />
  <Command.List>
    <Command.Empty>No results found.</Command.Empty>
    <Command.Group heading="Examples">
      {#each Object.entries(samples) as [path, loadSample] (path)}
        {@const name = path.substring(10, path.length - 3)}
        <Command.Item
          onSelect={async () => {
            open = false;
            onSelect((await loadSample()) as Sample);
          }}>{name}</Command.Item
        >
      {/each}
    </Command.Group>
  </Command.List>
</Command.Dialog>

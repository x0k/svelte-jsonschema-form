<script lang="ts">
  import lz from "lz-string";
  import { formPresetCategories, GROUPED_FORM_PRESETS } from "meta/playground";

  import Buttons from "./buttons.svelte";

  const { playgroundLink }: { playgroundLink: string } = $props();
</script>

{#each formPresetCategories() as category}
  <h3>{category}</h3>
  <Buttons
    items={GROUPED_FORM_PRESETS[category]!}
    onClick={async (preset) => {
      const data = await preset.load();
      window.open(
        `${playgroundLink}#${lz.compressToEncodedURIComponent(JSON.stringify(data))}`
      );
    }}
    label={(p) => p.name}
  />
{/each}

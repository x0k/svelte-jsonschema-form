<script lang="ts" module>
  import {
    type SampleCategory,
    SAMPLE_CATEGORIES,
  } from "apps/playground2/src/core/sample";

  const sampleCategories = import.meta.glob(
    "apps/playground2/src/samples/*.ts",
    {
      import: "category",
      eager: true,
    }
  );
  const sampleLoaders = import.meta.glob("apps/playground2/src/samples/*.ts", {
    eager: false,
    import: "default",
  });

  function getSampleName(path: string) {
    return path.substring(27, path.length - 3);
  }
  const groupedSamples = Object.groupBy(
    Object.keys(sampleCategories),
    (s) => sampleCategories[s] as SampleCategory
  );
</script>

<script lang="ts">
  import lz from "lz-string";
  import { PLAYGROUND_LINK } from "@/i18n";

  import Buttons from "./buttons.svelte";
</script>

{#each SAMPLE_CATEGORIES as category}
  <h3>{category}</h3>
  <Buttons
    items={groupedSamples[category]!}
    onClick={async (path) => {
      const sample = await sampleLoaders[path]();
      window.open(
        `${PLAYGROUND_LINK}#${lz.compressToEncodedURIComponent(JSON.stringify(sample))}`
      );
    }}
    label={getSampleName}
  />
{/each}

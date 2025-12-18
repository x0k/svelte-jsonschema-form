<script lang="ts" module>
  import {
    SAMPLE_CATEGORIES,
    type Sample,
    type SampleCategory,
  } from "./core/sample.js";

  const sampleCategories = import.meta.glob("./samples/*.ts", {
    import: "category",
    eager: true,
  });
  const sampleLoaders = import.meta.glob("./samples/*.ts", {
    import: "default",
    eager: false,
  });

  function getSampleName(path: string) {
    return path.substring(10, path.length - 3);
  }

  const sortedSamples = Object.keys(sampleLoaders)
    .map((path) => ({
      category: sampleCategories[path]! as SampleCategory,
      path,
      name: getSampleName(path),
      load: sampleLoaders[path]!,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
  const groupedSamples = Object.groupBy(sortedSamples, (s) => s.category);
</script>

<script lang="ts">
  import ExternalLink from "@lucide/svelte/icons/external-link";

  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import { Button, buttonVariants } from "$lib/components/ui/button/index.js";

  interface Props {
    onSelect: (sample: Sample) => void;
  }

  const { onSelect }: Props = $props();

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
    <div class="flex flex-col gap-2">
      {#each SAMPLE_CATEGORIES as category}
        <p class="pt-4 font-semibold" >{category}</p>
        <div class="flex gap-2 flex-wrap">
          {#each groupedSamples[category] as { path, name, load } (path)}
            <Button
              variant="secondary"
              onclick={async () => {
                open = false;
                onSelect((await load()) as Sample);
              }}
            >
              {name}
            </Button>
          {/each}
        </div>
      {/each}
    </div>
    <Dialog.Footer>
      <Button variant="link" href="../examples/advanced/"
        >Advanced examples <ExternalLink tabindex={-1} />
      </Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>

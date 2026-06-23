<script lang="ts">
  import ExternalLink from "@lucide/svelte/icons/external-link";
  import {
    formPresetCategories,
    GROUPED_FORM_PRESETS,
    type PresetEntry,
  } from "meta/playground";

  import { Button, buttonVariants } from "$lib/components/ui/button/index.js";
  import * as Dialog from "$lib/components/ui/dialog/index.js";

  interface Props {
    onSelect: (preset: PresetEntry) => void;
  }

  const { onSelect }: Props = $props();

  let open = $state.raw(false);
</script>

<Dialog.Root bind:open>
  <Dialog.Trigger class={buttonVariants({ variant: "outline" })}
    >Examples</Dialog.Trigger
  >
  <Dialog.Content class="max-w-md md:max-w-lg lg:max-w-xl">
    <Dialog.Header>
      <Dialog.Title>Examples</Dialog.Title>
    </Dialog.Header>
    <div class="flex flex-col gap-2">
      {#each formPresetCategories() as category}
        <p class="pt-4 font-semibold">{category}</p>
        <div class="flex flex-wrap justify-center gap-2">
          {#each GROUPED_FORM_PRESETS[category] as p (p.meta.title)}
            <Button
              variant="secondary"
              onclick={() => {
                open = false;
                onSelect(p);
              }}
            >
              {p.meta.title}
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

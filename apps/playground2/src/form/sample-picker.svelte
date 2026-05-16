<script lang="ts">
  import ExternalLink from "@lucide/svelte/icons/external-link";
  import {
    formPresetCategories,
    GROUPED_FORM_PRESETS,
    type FormPreset,
  } from "meta/playground";

  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import { Button, buttonVariants } from "$lib/components/ui/button/index.js";

  interface Props {
    onSelect: (sample: FormPreset) => void;
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
        <div class="flex gap-2 flex-wrap justify-center">
          {#each GROUPED_FORM_PRESETS[category] as { path, name, load } (path)}
            <Button
              variant="secondary"
              onclick={async () => {
                open = false;
                onSelect(await load());
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

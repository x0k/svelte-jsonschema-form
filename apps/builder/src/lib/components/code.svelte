<script lang="ts" module>
  export interface CodeFile {
    Icon: Component<SVGAttributes<SVGSVGElement>>;
    title: string;
    content: string;
    filepath: string;
  }
</script>

<script lang="ts">
  import { untrack, type Component } from "svelte";
  import type { SVGAttributes } from "svelte/elements";

  import { CopyButton } from "$lib/components/copy-button/index.js";
  import { Button } from "$lib/components/ui/button/index.js";

  interface Props {
    files: CodeFile[];
  }

  const { files }: Props = $props();

  let selectedIndex = $state(0);
  $effect(() => {
    files.length;
    untrack(() => {
      if (files.length > 0 && selectedIndex >= files.length) {
        selectedIndex = files.length - 1;
      }
    });
  });
  let selected = $derived(files[selectedIndex]);
</script>

<div>
  {#if selected}
    <div class="bg-background sticky top-(--header-height)">
      <div class="flex gap-2 overflow-x-auto rounded-t-md border p-2">
        {#each files as file, i (file.filepath || file.title)}
          <Button
            size="sm"
            variant="ghost"
            class={[
              "shrink-0",
              selectedIndex === i &&
                "bg-accent text-accent-foreground dark:bg-accent/50",
            ]}
            onclick={() => {
              selectedIndex = i;
            }}
          >
            <file.Icon />
            {file.title}</Button
          >
        {/each}
        <div class="bg-background sticky right-0 ml-auto shrink-0">
          <CopyButton size="sm" variant="ghost" text={() => selected.content} />
        </div>
      </div>
    </div>
    {#if selected.filepath}
      <div class="bg-background text-muted-foreground border border-t-0 p-2">
        {selected.filepath}
      </div>
    {/if}
    <div class="rounded-b-md border-x border-b">
      {@html selected.content}
    </div>
  {:else}
    <p class="text-muted-foreground rounded-md border p-4 text-center">
      No files
    </p>
  {/if}
</div>

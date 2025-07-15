<script lang="ts" module>
  import type { SupportedLanguage } from "$lib/shiki.js";

  export interface CodeFile {
    title: string;
    content: string;
    lang: SupportedLanguage;
  }
</script>

<script lang="ts">
  import { highlight } from "$lib/shiki.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import { CopyButton } from "$lib/components/copy-button/index.js";

  interface Props {
    files: CodeFile[];
  }

  const { files }: Props = $props();

  let selected = $derived(files[0]);
</script>

<div class="rounded-md border">
  {#if selected}
    <div class="flex gap-2 p-2 border-b">
      {#each files as file (file.title)}
        <Button
          size="sm"
          variant="ghost"
          class={[
            selected.title === file.title &&
              "bg-accent text-accent-foreground dark:bg-accent/50",
          ]}
          onclick={() => {
            selected = file;
          }}>{file.title}</Button
        >
      {/each}
      <CopyButton
        class="ml-auto"
        size="sm"
        variant="ghost"
        text={() => selected.content}
      />
    </div>
    <div>
      {@html highlight(selected.lang, selected.content)}
    </div>
  {:else}
    <p class="p-4 text-center text-muted-foreground">No files</p>
  {/if}
</div>

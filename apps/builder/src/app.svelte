<script lang="ts">
  import OpenBook from "@lucide/svelte/icons/book-open";
  import Download from '@lucide/svelte/icons/download';
  import Upload from '@lucide/svelte/icons/upload';

  import Github from "$lib/components/github.svelte";
  import { Button } from "$lib/components/ui/button/index.js";
  import { TooltipProvider } from "$lib/components/ui/tooltip/index.js";
  import Select from "$lib/components/select.svelte";
  import { highlighterPromise } from "$lib/shiki.js";
  import {
    blobOpen,
    blobSave,
    JSON_FILE_EXTENSION,
    JSON_MIME_TYPE,
    createJSONBlob,
    parseJSONBlob
  } from '$lib/file.js';

  import Builder from "./builder/builder.svelte";
  import { BuilderContext } from './builder/context.svelte.js';
  import { setShadcnContext } from "./shadcn-context.js";
  import { themeManager } from "./theme.svelte.js";
  import { THEME_TITLES, THEMES } from "./shared/index.js";

  setShadcnContext();

  const clearLink = new URL(location.href);
  clearLink.search = "";
  clearLink.hash = "";
</script>

<TooltipProvider delayDuration={0}>
  <div
    class="min-h-screen bg-background dark:[color-scheme:dark]"
    style="--header-height: 60px;"
  >
    {#await highlighterPromise}
      <p>Loading...</p>
    {:then highlighter}
      {@const ctx = new BuilderContext(highlighter)}
      <div class="sticky top-0 z-50 bg-background">
        <div class="mx-auto px-8 py-3 flex gap-2 items-center">
          <a href={clearLink.toString()} class="text-xl font-bold mr-auto"
            >Form Builder</a
          >
          <Button
            variant="ghost"
            onclick={async () => {
              ctx.importState(
                await parseJSONBlob(
                  await blobOpen({
                    extensions: [JSON_FILE_EXTENSION],
                    mimeTypes: [JSON_MIME_TYPE]
                  }),
                )
              )
            }}
          >
            <Upload class="size-6" />
            Import
          </Button>
          <Button
            variant="ghost"
            onclick={async () => {
              await blobSave(
                `data.${JSON_FILE_EXTENSION}`,
                createJSONBlob(
                  JSON.stringify(ctx.exportState())
                )
              )
            }}
          >
            <Download class="size-6" />
            Export
          </Button>
          <Button
            variant="ghost"
            href="https://x0k.github.io/svelte-jsonschema-form/"
            >
            <OpenBook class="size-6" />
            Docs
          </Button>
          <Button
            target="_blank"
            href="https://github.com/x0k/svelte-jsonschema-form/"
            variant="ghost"
            >
            <Github class="size-6" />
            GitHub
          </Button>
          <Select
            bind:value={themeManager.theme}
            items={THEMES}
            labels={THEME_TITLES}
          />
        </div>
      </div>
      <Builder {ctx} />
    {/await}
  </div>
</TooltipProvider>

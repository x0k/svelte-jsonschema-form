<script lang="ts">
  import OpenBook from "@lucide/svelte/icons/book-open";
  import Moon from '@lucide/svelte/icons/moon';
  import Sun from '@lucide/svelte/icons/sun';
  import { openDB } from 'idb';

  import Github from "$lib/components/github.svelte";
  import { Button } from "$lib/components/ui/button/index.js";
  import { TooltipProvider } from "$lib/components/ui/tooltip/index.js";
  import { highlighterPromise } from "$lib/shiki.js";
  import { Toaster } from "$lib/components/ui/sonner/index.js";

  import type { AppDBSchema } from "./shared/index.js";
  import Builder from "./builder/builder.svelte";
  import { BuilderContext } from './builder/context.svelte.js';
  import { setShadcnContext } from "./shadcn-context.js";
  import { themeManager } from "./theme.svelte.js";
  import { AppContext } from './app/context.svelte.js';
  import { IDBProjectsRepository } from './app/idb-projects-repository.js';
  import ProjectsControls from './app/projects-controls.svelte';
  import ProjectsDialog from './app/projects-dialog.svelte';

  setShadcnContext();

  const clearLink = new URL(location.href);
  clearLink.search = "";
  clearLink.hash = "";

  const promises = Promise.all([highlighterPromise, openDB<AppDBSchema>("builder-db", 1, {
    upgrade(db, oldVersion) {
      if (oldVersion < 1) {
        const projects = db.createObjectStore('projects', {
          keyPath: "id"
        })
        projects.createIndex('titleIndex', 'title', { unique: true })
        projects.createIndex('updatedAtIndex', 'updatedAt')
      }
    }
  })])
</script>

<Toaster richColors theme={themeManager.theme} />
<TooltipProvider delayDuration={0}>
  <div
  class="min-h-screen bg-background dark:scheme-dark"
  style="--header-height: 60px;"
  >
    {#await promises}
      <p>Loading...</p>
    {:then [highlighter, db]}
      {@const ctx = new BuilderContext(highlighter)}
      {@const app = new AppContext(ctx, new IDBProjectsRepository(db))}
      <div class="sticky top-0 z-50 bg-background">
        <div class="mx-auto px-8 py-3 flex gap-2 items-center">
          <a href={clearLink.toString()} class="text-xl font-bold"
            >Form Builder</a
          >
          <ProjectsDialog {app} class="mr-auto" />
          <ProjectsControls {app} />
          <Button
            variant="ghost"
            size="icon"
            href="https://x0k.github.io/svelte-jsonschema-form/"
            >
            <OpenBook class="size-6" />
          </Button>
          <Button
            target="_blank"
            href="https://github.com/x0k/svelte-jsonschema-form/"
            variant="ghost"
            size="icon"
            >
            <Github class="size-6" />
          </Button>
          <Button variant="ghost" size="icon" onclick={() => {
            themeManager.isDark = !themeManager.isDark
          }} >
            {#if themeManager.isDark}
              <Moon class="size-6" />
            {:else}
              <Sun class="size-6" />
            {/if}
          </Button>
        </div>
      </div>
      <Builder {ctx} />
    {/await}
  </div>
</TooltipProvider>

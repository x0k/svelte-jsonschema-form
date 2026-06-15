<script lang="ts">
  import { openDB } from "idb";

  import { Toaster } from "$lib/components/ui/sonner/index.js";
  import { TooltipProvider } from "$lib/components/ui/tooltip/index.js";
  import { highlighterPromise } from "$lib/shiki.js";

  import Builder from "./builder/builder.svelte";
  import { BuilderContext } from "./builder/context.svelte.js";
  import Header from "./header.svelte";
  import { ProjectsContext } from "./projects/context.svelte.js";
  import { IDBProjectsRepository } from "./projects/idb-projects-repository.js";
  import { setShadcnContext } from "./shadcn-context.js";
  import type { AppDBSchema } from "./shared/index.js";
  import { themeManager } from "./theme.svelte.js";

  setShadcnContext();

  const promises = Promise.all([
    highlighterPromise,
    openDB<AppDBSchema>("builder-db", 1, {
      upgrade(db, oldVersion) {
        if (oldVersion < 1) {
          const projects = db.createObjectStore("projects", {
            keyPath: "id",
          });
          projects.createIndex("titleIndex", "title", { unique: true });
          projects.createIndex("updatedAtIndex", "updatedAt");
        }
      },
    }),
  ]);
</script>

<Toaster richColors theme={themeManager.theme} />
<TooltipProvider delayDuration={0}>
  <div
    class="bg-background min-h-screen dark:scheme-dark"
    style="--header-height: 60px;"
  >
    {#await promises}
      <p>Loading...</p>
    {:then [highlighter, db]}
      {@const builder = new BuilderContext(highlighter)}
      {@const projects = new ProjectsContext(
        builder,
        new IDBProjectsRepository(db)
      )}
      <div class="bg-background sticky top-0 z-50">
        <Header ctx={projects} />
      </div>
      <Builder ctx={builder} />
    {/await}
  </div>
</TooltipProvider>

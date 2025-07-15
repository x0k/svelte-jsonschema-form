<script lang="ts">
  import OpenBook from "@lucide/svelte/icons/book-open";

  import Github from "$lib/components/github.svelte";
  import { Button } from "$lib/components/ui/button/index.js";
  import { TooltipProvider } from "$lib/components/ui/tooltip/index.js";

  import Builder from "./builder/builder.svelte";
  import { setShadcnContext } from "./shadcn-context.js";

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
    <div class="sticky top-0 z-50 bg-background">
      <div class="mx-auto px-8 py-3 flex gap-2 items-center">
        <a href={clearLink.toString()} class="text-xl font-bold mr-auto"
          >Form Builder</a
        >
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
          size="icon"
          variant="ghost"
        >
          <Github class="size-6" />
        </Button>
      </div>
    </div>
    <Builder />
  </div>
</TooltipProvider>

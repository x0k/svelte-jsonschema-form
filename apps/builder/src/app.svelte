<script lang="ts">
  import { TooltipProvider } from "$lib/components/ui/tooltip/index.js";

  import { setShadcnContext } from "./shadcn-context.js";
  import Builder from "./builder/builder.svelte";

  setShadcnContext();
</script>

<TooltipProvider delayDuration={0}>
  <div
    class="min-h-screen bg-background dark:[color-scheme:dark]"
    style="--header-height: 60px;"
  >
    <div class="sticky top-0 z-50 bg-background">
      <div class="mx-auto px-8 py-4">
        <h1 class="text-xl font-bold">Form Builder</h1>
      </div>
    </div>
    <Builder />
  </div>
</TooltipProvider>

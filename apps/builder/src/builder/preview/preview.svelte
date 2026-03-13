<script lang="ts">
  import type { PreviewRoute } from "../model.js";
  import PreviewContent from "./content.svelte";
  import PreviewControls from "./controls.svelte";
  import PreviewSettings from "./settings.svelte";

  const { route }: { route: PreviewRoute } = $props();
</script>

<div class="mx-auto grid grid-cols-[1fr_6fr_2fr] gap-6">
  <div
    class="sticky top-(--header-height) h-[calc(100vh-var(--header-height))] min-w-[120px] overflow-y-auto pb-4 pl-8"
  >
    <PreviewControls />
  </div>

  <div class="pb-4">
    <PreviewContent {route} />
  </div>

  <div
    class="sticky top-(--header-height) h-[calc(100vh-var(--header-height))] min-w-[200px] overflow-y-auto pr-8 pb-4"
  >
    <PreviewSettings />
  </div>
</div>

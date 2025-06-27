<script lang="ts">
  import {
    Controls,
    Builder,
    BuilderContext,
    setBuilderContext,
    Settings,
  } from "./builder/index.js";

  const ctx = new BuilderContext();
  setBuilderContext(ctx);
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  class="grid grid-cols-[1fr_4fr_2fr] grid-rows-[auto_1fr] h-screen py-4 px-8 gap-4 max-w-[80rem] mx-auto"
  onclick={() => {
    ctx.clearSelection();
  }}
>
  <div class="col-span-3">Form builder</div>
  <div>
    <Controls />
  </div>
  <div>
    <Builder />
  </div>
  <div>
    <Settings />
  </div>
</div>

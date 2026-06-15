<script lang="ts">
  import { getBuilderContext } from "../context.svelte.js";
  import Form from "../preview/form.svelte";

  import Content from "./content.svelte";
  import Settings from "./settings.svelte";
  import Controls from "./controls.svelte";

  const ctx = getBuilderContext();
</script>

<div
  class={[
    "mx-auto grid gap-6",
    ctx.livePreview ? "grid-cols-[1fr_3fr_3fr_2fr]" : "grid-cols-[1fr_6fr_2fr]",
  ]}
>
  <div
    class="sticky top-(--header-height) h-[calc(100vh-var(--header-height))] min-w-[120px] overflow-y-auto pb-4 pl-8"
  >
    <Controls />
  </div>

  <div class="pb-4">
    <Content />
  </div>

  {#if ctx.livePreview}
    <div class="overflow-x-hidden pb-4">
      <Form />
    </div>
  {/if}

  <div
    class="sticky top-(--header-height) h-[calc(100vh-var(--header-height))] min-w-[200px] overflow-y-auto pr-8 pb-4"
  >
    <Settings />
  </div>
</div>

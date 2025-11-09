<script lang="ts">
  import { RouteName } from "./model.js";
  import { BuilderContext, setBuilderContext } from "./context.svelte.js";
  import Builder from "./editor/editor.svelte";
  import Preview from "./preview/preview.svelte";

  const { ctx }: { ctx: BuilderContext } = $props();

  setBuilderContext(ctx);
</script>

{#if ctx.route.name === RouteName.Preview}
  <Preview route={ctx.route} />
{:else}
  <Builder />
{/if}

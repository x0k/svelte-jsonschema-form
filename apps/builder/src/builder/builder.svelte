<script lang="ts">
  import { BuilderContext, setBuilderContext } from "./context.svelte.js";
  import Builder from "./editor/editor.svelte";
  import { RouteName } from "./model.js";
  import Preview from "./preview/preview.svelte";

  const { ctx }: { ctx: BuilderContext } = $props();

  // svelte-ignore state_referenced_locally
  setBuilderContext(ctx);
</script>

{#if ctx.route.name === RouteName.Preview}
  <Preview route={ctx.route} />
{:else}
  <Builder />
{/if}

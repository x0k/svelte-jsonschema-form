<script lang="ts">
  import { RouteName } from "./model.js";
  import { BuilderContext, setBuilderContext } from "./context.svelte.js";
  import Builder from "./editor/editor.svelte";
  import Preview from "./preview/preview.svelte";

  const ctx = new BuilderContext();
  setBuilderContext(ctx);

  const hash = location.hash.substring(1);
  if (hash !== "") {
    ctx.importState(hash);
  }
</script>

{#if ctx.route.name === RouteName.Preview}
  <Preview route={ctx.route} />
{:else}
  <Builder />
{/if}

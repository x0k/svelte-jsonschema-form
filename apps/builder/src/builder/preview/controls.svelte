<script lang="ts">
  import Eye from "@lucide/svelte/icons/eye";
  import Code from "@lucide/svelte/icons/code";
  import Braces from "@lucide/svelte/icons/braces";

  import { getBuilderContext } from "../context.svelte.js";

  import { PreviewSubRouteName, RouteName } from "../model.js";

  const ctx = getBuilderContext();

  function preview(subRoute?: PreviewSubRouteName) {
    return () => {
      ctx.route = { name: RouteName.Preview, subRoute };
    };
  }
</script>

<div class="flex flex-col gap-2">
  <button
    class="flex items-center gap-2 p-2 rounded-md cursor-pointer border hover:bg-accent"
    onclick={preview()}
  >
    <Eye class="size-4" />
    <span class="text-sm font-medium text-foreground">Preview</span>
  </button>
  <button
    class="flex items-center gap-2 p-2 rounded-md cursor-pointer border hover:bg-accent"
    onclick={preview(PreviewSubRouteName.Code)}
  >
    <Code class="size-4" />
    <span class="text-sm font-medium text-foreground">Code</span>
  </button>
  <button
    class="flex items-center gap-2 p-2 rounded-md cursor-pointer border hover:bg-accent"
    onclick={preview(PreviewSubRouteName.Schema)}
  >
    <Braces class="size-4" />
    <span class="text-sm font-medium text-foreground">Schemas</span>
  </button>
</div>

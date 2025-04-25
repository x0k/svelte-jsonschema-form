<script lang="ts">
  import type { ComponentProps } from "@/form/index.js";

  import ArrayBase from "./array-base.svelte";
  import { createTupleContext } from "./context.svelte.js";

  let { value = $bindable(), config, uiOption }: ComponentProps["tupleField"] = $props();
</script>

<ArrayBase
  createArrayContext={createTupleContext}
  {config}
  {uiOption}
  type="field"
  bind:value
/>

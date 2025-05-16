<script lang="ts">
  import type { ComponentProps } from "@/form/index.js";

  import ArrayBase from "./array-base.svelte";
  import { createTupleContext } from "./context.svelte.js";

  let {
    value = $bindable(),
    config,
    uiOption,
    translate,
  }: ComponentProps["tupleField"] = $props();
</script>

<ArrayBase
  type="field"
  bind:value
  {config}
  {uiOption}
  {translate}
  createArrayContext={createTupleContext}
/>

<script lang="ts">
  import type { ComponentProps } from "@/form/index.js";

  import ArrayBase from "./array-base.svelte";
  import { createArrayContext } from "./context.svelte.js";

  let {
    value = $bindable(),
    config,
    uiOption,
    translate,
  }: ComponentProps["arrayField"] = $props();
</script>

<ArrayBase
  type="field"
  bind:value
  {config}
  {uiOption}
  {translate}
  {createArrayContext}
/>

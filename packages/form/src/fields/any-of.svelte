<script lang="ts">
  import { ANY_OF_KEY } from "@/core/index.js";
  import type { ComponentProps } from "@/form/index.js";

  import Combination from "./combination.svelte";

  let {
    value = $bindable(),
    config,
    uiOption,
    translate,
  }: ComponentProps["anyOfField"] = $props();
</script>

<Combination
  type="field"
  bind:value
  {config}
  {uiOption}
  {translate}
  combinationKey={ANY_OF_KEY}
/>

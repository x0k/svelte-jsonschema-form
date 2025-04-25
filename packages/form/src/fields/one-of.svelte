<script lang="ts">
  import { ONE_OF_KEY } from "@/core/index.js";
  import type { ComponentProps } from "@/form/index.js";

  import Combination from "./combination.svelte";

  let {
    config,
    uiOption,
    value = $bindable(),
  }: ComponentProps["oneOfField"] = $props();
</script>

<Combination
  type="field"
  bind:value
  {config}
  {uiOption}
  combinationKey={ONE_OF_KEY}
/>

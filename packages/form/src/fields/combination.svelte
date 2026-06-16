<!--
@component
@deprecated Use `@sjsf/form/fields/combination/combination.svelte` instead.
-->

<script lang="ts">
  import type { ComponentProps } from "@/form/index.js";

  import Combination from "./combination/combination.svelte";
  import type { CombinationKey } from "./combination/context.svelte.js";

  let {
    value = $bindable(),
    config,
    combinationKey,
    uiOption,
    translate,
  }: ComponentProps["anyOfField" | "oneOfField"] & {
    combinationKey: CombinationKey;
  } = $props();
</script>

<Combination
  type="field"
  bind:value
  {config}
  {uiOption}
  {translate}
  {combinationKey}
/>

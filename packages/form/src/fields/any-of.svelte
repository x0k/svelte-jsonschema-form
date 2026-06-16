<!--
@component
@deprecated Use `@sjsf/form/fields/combination/any-of.svelte` instead.
-->

<script lang="ts">
  import type { ComponentProps } from "@/form/index.js";

  import AnyOf from "./combination/any-of.svelte";

  let {
    value = $bindable(),
    config,
    uiOption,
    translate,
  }: ComponentProps["anyOfField"] = $props();
</script>

<AnyOf type="field" bind:value {config} {uiOption} {translate} />

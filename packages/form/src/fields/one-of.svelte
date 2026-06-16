<!--
@component
@deprecated Use `@sjsf/form/fields/combination/one-of.svelte` instead.
-->

<script lang="ts">
  import type { ComponentProps } from "@/form/index.js";

  import OneOf from "./combination/one-of.svelte";

  let {
    config,
    uiOption,
    value = $bindable(),
    translate,
  }: ComponentProps["oneOfField"] = $props();
</script>

<OneOf type="field" bind:value {config} {uiOption} {translate} />

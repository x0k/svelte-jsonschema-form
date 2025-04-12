<script lang="ts">
  import type { ComponentProps } from "@/form/index.js";

  import ArrayBase from "./array-base.svelte";

  let { value = $bindable(), config }: ComponentProps["tupleField"] = $props();
</script>

<ArrayBase isTuple {config} type="field" bind:value />

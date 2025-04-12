<script lang="ts">
  import type { ComponentProps } from "@/form/index.js";

  import ArrayBase from "./array-base.svelte";

  let { value = $bindable(), config }: ComponentProps["arrayField"] = $props();
</script>

<ArrayBase isTuple={false} {config} type="field" bind:value />

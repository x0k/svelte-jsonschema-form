<script lang="ts">
  import type { ComponentProps } from "@/form/index.js";

  import ArrayBase from "./array-base.svelte";
  import { createArrayContext } from "./context.svelte.js";

  let { value = $bindable(), config }: ComponentProps["arrayField"] = $props();
</script>

<ArrayBase {createArrayContext} {config} type="field" bind:value />

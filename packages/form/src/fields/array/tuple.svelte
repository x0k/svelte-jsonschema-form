<script lang="ts">
  import type { ComponentProps } from "@/form/index.js";

  import ArrayBase from "./array-base.svelte";
  import { createTupleContext } from "./context.svelte.js";

  let { value = $bindable(), config }: ComponentProps["tupleField"] = $props();
</script>

<ArrayBase
  createArrayContext={createTupleContext}
  {config}
  type="field"
  bind:value
/>

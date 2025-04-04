<script lang="ts">
  import { ANY_OF_KEY } from "@/core/index.js";
  import type { ComponentProps } from "@/form/index.js";

  import Combination from "./combination.svelte";

  let {
    type,
    config,
    value = $bindable(),
  }: ComponentProps["anyOfField"] = $props();
</script>

<Combination {type} bind:value {config} combinationKey={ANY_OF_KEY} />

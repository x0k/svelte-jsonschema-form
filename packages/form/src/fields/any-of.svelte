<script lang="ts">
  import { ANY_OF_KEY } from "@/core/index.js";
  import type { ComponentProps } from "@/form/index.js";

  import Combination from "./combination.svelte";

  let { config, value = $bindable() }: ComponentProps["anyOfField"] = $props();
</script>

<Combination bind:value {config} combinationKey={ANY_OF_KEY} />

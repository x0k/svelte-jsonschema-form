<script lang="ts">
  import { ONE_OF_KEY } from "@/core/index.js";
  import type { ComponentProps } from "@/form/index.js";

  import Combination from "./combination.svelte";

  let { config, value }: ComponentProps["oneOfField"] = $props();
</script>

<Combination bind:value {config} combinationKey={ONE_OF_KEY} />

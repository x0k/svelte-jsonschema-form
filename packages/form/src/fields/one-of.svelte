<script lang="ts" module>
  const field = "oneOfField";
  declare module "../form/index.js" {
    interface ActionFields {
      [field]: {};
    }
  }
</script>

<script lang="ts">
  import { ONE_OF_KEY } from "@/core/index.js";
  import type { ComponentProps } from "@/form/index.js";

  import Combination from "./combination.svelte";

  let {
    config,
    uiOption,
    value = $bindable(),
    translate,
  }: ComponentProps[typeof field] = $props();
</script>

<Combination
  type="field"
  bind:value
  {config}
  {uiOption}
  {translate}
  combinationKey={ONE_OF_KEY}
/>

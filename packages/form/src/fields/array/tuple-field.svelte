<script lang="ts" module>
  declare module "../../form/index.js" {
    interface ActionFields {
      tupleField: {};
    }
  }
</script>

<script lang="ts">
  import type { ComponentProps } from "@/form/index.js";

  import ArrayBase from "./array-base.svelte";
  import { createTupleContext } from "./context.svelte.js";

  let {
    value = $bindable(),
    config,
    uiOption,
    translate,
  }: ComponentProps["tupleField"] = $props();
</script>

<ArrayBase
  type="field"
  field="tupleField"
  bind:value
  {config}
  {uiOption}
  {translate}
  createContext={createTupleContext}
/>

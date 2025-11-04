<script lang="ts" module>
  declare module "../../form/index.js" {
    interface ActionFields {
      arrayField: {};
    }
  }
</script>

<script lang="ts">
  import type { ComponentProps } from "@/form/index.js";

  import ArrayBase from "./array-base.svelte";
  import { createArrayContext } from "./context.svelte.js";

  let {
    value = $bindable(),
    config,
    uiOption,
    translate,
  }: ComponentProps["arrayField"] = $props();
</script>

<ArrayBase
  type="field"
  field="arrayField"
  bind:value
  {config}
  {uiOption}
  {translate}
  createContext={createArrayContext}
/>

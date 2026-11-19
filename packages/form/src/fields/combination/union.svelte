<script lang="ts" module>
  const key = `union`;
  // Keep the name a string literal: `packages/meta/scripts/extract-fields.ts`
  // reads it to build the field registry.
  const field = "unionField";
  declare module "../../form/index.js" {
    interface ActionFields {
      [field]: {};
    }
  }
</script>

<script lang="ts">
  import type { ComponentProps } from "#form/index.js";

  import Combination from "./combination.svelte";
  import { createUnionCombinationContext } from "./context.svelte.js";

  let {
    value = $bindable(),
    config,
    uiOption,
    translate,
  }: ComponentProps[typeof field] = $props();
</script>

<Combination
  type="field"
  bind:value
  {field}
  {config}
  {uiOption}
  {translate}
  restFieldConfig={undefined}
  createContext={(options) =>
    createUnionCombinationContext({
      ...options,
      pseudoSuffix: () => key,
      schemas: () => [config.schema],
      uiSchemas: () => config.uiSchema.union ?? [],
    })}
/>

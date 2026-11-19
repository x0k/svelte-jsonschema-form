<script lang="ts" module>
  const key = `oneOf`;
  // Keep the name a string literal: `packages/meta/scripts/extract-fields.ts`
  // reads it to build the field registry.
  const field = "oneOfField";
  const suffix = key.toLowerCase() as Lowercase<typeof key>;
  declare module "../../form/index.js" {
    interface ActionFields {
      [field]: {};
    }
  }
</script>

<script lang="ts">
  import type { ComponentProps } from "#form/index.js";

  import Combination from "./combination.svelte";
  import {
    createXxxOfCombinationContext,
    deriveXxxOfRestConfig,
  } from "./context.svelte.js";

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
  restFieldConfig={deriveXxxOfRestConfig(config, key)}
  createContext={(options) =>
    createXxxOfCombinationContext({
      ...options,
      pseudoSuffix: () => suffix,
      schemas: () => config.schema[key] ?? [],
      uiSchemas: () => config.uiSchema[key] ?? [],
    })}
/>

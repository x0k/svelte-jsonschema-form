<script lang="ts">
  import { ANY_OF_KEY, getSimpleSchemaType, ONE_OF_KEY } from "@/core/index.js";

  import {
    getComponent,
    getFormContext,
    type ComponentProps,
  } from "@/form/index.js";

  const ctx = getFormContext();

  let { config, value = $bindable() }: ComponentProps["root"] = $props();

  const combinationKey = $derived(
    config.schema.anyOf !== undefined
      ? ANY_OF_KEY
      : config.schema.oneOf !== undefined
        ? ONE_OF_KEY
        : undefined
  );
</script>

{#if combinationKey}
  {@const MultiField = getComponent(ctx, "multiField", config)};
  <MultiField {combinationKey} bind:value {config} />
{:else}
  {@const schemaType = getSimpleSchemaType(config.schema)}
  {@const Field = getComponent(ctx, `${schemaType}Field`, config)}
  <Field bind:value={value as undefined} {config} />
{/if}

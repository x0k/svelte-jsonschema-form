<script lang="ts">
  import {
    Text,
    getComponent,
    getFormContext,
    type ComponentProps,
  } from "@/form/index.js";

  import { createObjectContext, setObjectContext } from "./context.svelte.js";
  import { isSchemaObjectValue } from '@/core/value.js';

  const ctx = getFormContext();

  let { config, value = $bindable() }: ComponentProps["objectField"] = $props();

  const objCtx = createObjectContext(
    ctx,
    () => config,
    () => value,
    (v) => (value = v)
  );
  setObjectContext(objCtx);

  const ObjectProperty = $derived(
    getComponent(ctx, "objectPropertyField", config)
  );
  const Template = $derived(getComponent(ctx, "objectTemplate", config));
  const Button = $derived(getComponent(ctx, "button", config));
</script>

{#snippet addButton()}
  <Button
    type="object-property-add"
    {config}
    errors={objCtx.errors}
    disabled={false}
    onclick={objCtx.addProperty}
  >
    <Text {config} id="add-object-property" />
  </Button>
{/snippet}
<Template
  type="template"
  {value}
  {config}
  errors={objCtx.errors}
  addButton={objCtx.canExpand ? addButton : undefined}
>
  {#if isSchemaObjectValue(value)}
    {#each objCtx.propertiesOrder as property (property)}
      {@const isAdditional = objCtx.isAdditionalProperty(property)}
      <ObjectProperty
        type="field"
        {property}
        {isAdditional}
        bind:value={value[property]}
        config={objCtx.propertyConfig(config, property, isAdditional)}
      />
    {/each}
  {/if}
</Template>

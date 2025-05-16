<script lang="ts">
  import { isSchemaObjectValue } from "@/core/value.js";
  import {
    Text,
    getComponent,
    getFormContext,
    retrieveTranslate,
    retrieveUiOption,
    type ComponentProps,
  } from "@/form/index.js";

  import { createObjectContext, setObjectContext } from "./context.svelte.js";

  const ctx = getFormContext();

  let {
    config,
    value = $bindable(),
    uiOption,
    translate,
  }: ComponentProps["objectField"] = $props();

  const objCtx = createObjectContext(
    ctx,
    () => config,
    () => value,
    (v) => (value = v),
    translate,
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
    <Text {config} id="add-object-property" {translate} />
  </Button>
{/snippet}
<Template
  type="template"
  {value}
  {config}
  errors={objCtx.errors}
  addButton={objCtx.canExpand ? addButton : undefined}
  {uiOption}
>
  {#if isSchemaObjectValue(value)}
    {#each objCtx.propertiesOrder as property (property)}
      {@const isAdditional = objCtx.isAdditionalProperty(property)}
      {@const cfg = objCtx.propertyConfig(config, property, isAdditional)}
      <ObjectProperty
        type="field"
        {property}
        {isAdditional}
        bind:value={value[property]}
        config={cfg}
        uiOption={(opt) => retrieveUiOption(ctx, cfg, opt)}
        translate={retrieveTranslate(ctx, cfg)}
      />
    {/each}
  {/if}
</Template>

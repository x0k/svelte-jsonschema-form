<script lang="ts" module>
  import "@/form/extra-fields/object-property.js";
  import "@/form/extra-fields/object-key-input.js";
  import "../extra-templates/object-property.js";

  declare module "../components.js" {
    interface ButtonTypes {
      "object-property-remove": {};
    }
  }
</script>

<script lang="ts">
  import {
    getComponent,
    getFieldErrors,
    getFieldComponent,
    getFormContext,
    retrieveUiSchema,
    Text,
    type ComponentProps,
    type Config,
    getPseudoPath,
    uiTitleOption,
    retrieveUiOption,
    retrieveTranslate,
  } from "@/form/index.js";

  import { getObjectContext } from "./context.svelte.js";

  let {
    config,
    property,
    isAdditional,
    value = $bindable(),
    uiOption,
    translate,
  }: ComponentProps["objectPropertyField"] = $props();

  const ctx = getFormContext();
  const objCtx = getObjectContext();

  const Template = $derived(
    getComponent(ctx, "objectPropertyTemplate", config)
  );
  const Field = $derived(getFieldComponent(ctx, config));
  const Button = $derived(getComponent(ctx, "button", config));
  const errors = $derived(getFieldErrors(ctx, config.path));
</script>

{#snippet keyInput()}
  {@const schemas = objCtx.keyInputSchemas()}
  {@const keyInputConfig: Config = {
    ...schemas,
    path: getPseudoPath(ctx, config.path, 'key-input'),
    title: uiTitleOption(ctx, schemas.uiSchema) ?? translate("key-input-title", { name: property }),
    required: true,
  }}
  {@const KeyInputField = getComponent(
    ctx,
    "objectKeyInputField",
    keyInputConfig
  )}
  <KeyInputField
    type="field"
    bind:value={
      () => property, (v) => objCtx.renameProperty(property, v, keyInputConfig)
    }
    config={keyInputConfig}
    uiOption={(opt) => retrieveUiOption(ctx, keyInputConfig, opt)}
    translate={retrieveTranslate(ctx, keyInputConfig)}
  />
{/snippet}
{#snippet removeButton()}
  <Button
    {errors}
    {config}
    type="object-property-remove"
    disabled={false}
    onclick={() => {
      objCtx.removeProperty(property);
    }}
  >
    <Text {config} id="remove-object-property" {translate} />
  </Button>
{/snippet}
<Template
  type="template"
  {property}
  {value}
  {config}
  {errors}
  keyInput={isAdditional ? keyInput : undefined}
  removeButton={isAdditional ? removeButton : undefined}
  {uiOption}
>
  <Field
    type="field"
    bind:value={value as undefined}
    {config}
    {uiOption}
    {translate}
  />
</Template>

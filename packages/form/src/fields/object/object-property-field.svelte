<script lang="ts" module>
  import "@/form/extra-fields/object-property.js";
  import "../extra-templates/object-property.js";

  declare module "../components.js" {
    interface ButtonTypes {
      "object-property-remove": {};
    }
  }
</script>

<script lang="ts">
  import {
    type Config,
    type ComponentProps,
    getComponent,
    getFieldErrors,
    getFieldComponent,
    getFormContext,
    retrieveUiSchema,
    Text,
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

  let key = $derived<string | undefined>(property);
</script>

{#snippet keyInput()}
  {@const keyInputUiSchema = retrieveUiSchema(
    ctx,
    config.uiSchema.additionalPropertyKeyInput
  )}
  {@const keyInputConfig: Config = {
    path: getPseudoPath(ctx, config.path, 'key-input'),
    title: uiTitleOption(ctx, keyInputUiSchema) ?? translate("key-input-title", { name: property }),
    schema: objCtx.keyInputSchema(),
    required: true,
    uiSchema: keyInputUiSchema,
  }}
  {@const KeyInputField = getFieldComponent(ctx, keyInputConfig)}
  <KeyInputField
    type="field"
    bind:value={key as undefined}
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

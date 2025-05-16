<script lang="ts" module>
  declare module "../../form/index.js" {
    interface FoundationalComponents {
      objectPropertyField: {};
    }
    interface ComponentProps {
      objectPropertyField: FieldCommonProps<SchemaValue> & {
        property: string;
        isAdditional: boolean;
      };
    }
    interface ComponentBindings {
      objectPropertyField: "value";
    }
  }
</script>

<script lang="ts">
  import {
    getComponent,
    getErrors,
    getFieldComponent,
    getFormContext,
    retrieveUiSchema,
    Text,
    type ComponentProps,
    type FieldCommonProps,
    type SchemaValue,
  } from "@/form/index.js";

  import { getObjectContext } from "./context.svelte.js";
  import ObjectKeyInput from "./object-key-input.svelte";

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
  const errors = $derived(getErrors(ctx, config.id));
</script>

{#snippet keyInput()}
  <ObjectKeyInput
    {translate}
    {property}
    name={config.name}
    parentId={config.id}
    uiSchema={retrieveUiSchema(ctx, config.uiSchema.additionalPropertyKeyInput)}
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

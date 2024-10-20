<script lang="ts">
  import {
    getDefaultValueForType,
    getSimpleSchemaType,
    isAdditionalProperty,
    isSchemaExpandable,
    isSchemaObjectValue,
    orderProperties,
  } from '@/core/index.js';

  import type { UiSchema } from '../../ui-schema.js';
  import { FAKE_ID_SCHEMA } from '../../id-schema.js';
  import {
    getTemplate,
    getComponent,
    isDisabled,
    getField,
    getDefaultFormState,
    getErrors,
    getUiOptions,
    retrieveSchema,
    getFormContext
  } from "../../context/index.js";

  import type { FieldProps } from "../model.js";

  import { setObjectContext, type ObjectContext } from './context.js';
  import { generateNewKey } from './generate-new-object-key.js';
  import { createOriginalKeysOrder } from './create-original-keys-order.js';

  const ctx = getFormContext();

  let {
    config,
    value = $bindable(),
  }: FieldProps<"object"> = $props();
  $effect(() => {
    if (value === undefined) {
      value = {}
    }
  })
  
  const newKeySeparator = $derived(config.uiOptions?.duplicateKeySuffixSeparator ?? "-")
  const objCtx: ObjectContext = {
    get newKeySeparator() {
      return newKeySeparator
    }
  }
  setObjectContext(objCtx)
  
  // NOTE: This is required for computing a schema which will include all additional properties
  //       in the `properties` field with the `ADDITIONAL_PROPERTY_FLAG` flag.
  const retrievedSchema = $derived(retrieveSchema(ctx, config.schema, value))
  const requiredProperties = $derived(new Set(retrievedSchema.required));
  const schemaProperties = $derived(retrievedSchema.properties);
  const schemaPropertiesOrder = $derived(
    isSchemaObjectValue(schemaProperties)
    ? orderProperties(schemaProperties, config.uiOptions?.order ?? createOriginalKeysOrder(schemaProperties))
    : []
  );

  const ObjectProperty = $derived(getField(ctx, "objectProperty", config));
  const Template = $derived(getTemplate(ctx, "object", config));
  const Button = $derived(getComponent(ctx, "button", config));
  
  const disabled = $derived(isDisabled(ctx, config.uiOptions?.input))
  
  const schemaAdditionalProperties = $derived(
    isSchemaObjectValue(retrievedSchema.additionalProperties) ? retrieveSchema(ctx, retrievedSchema.additionalProperties, value) : {}
  )
  const canExpand = $derived(config.uiOptions?.expandable !== false && isSchemaExpandable(retrievedSchema, value))
  const errors = $derived(getErrors(ctx, config.idSchema));
</script>

{#snippet addButton()}
  <Button
    type="object-property-add"
    {config}
    {errors}
    {disabled}
    attributes={config.uiOptions?.button}
    onclick={(e) => {
      e.preventDefault();
      if (value === undefined) {
        console.warn("Object value is undefined")
        return
      }
      const newKey = generateNewKey("newKey", newKeySeparator, value)
      value[newKey] = getDefaultFormState(ctx, schemaAdditionalProperties, undefined)
        ?? getDefaultValueForType(getSimpleSchemaType(schemaAdditionalProperties))
    }}
  >
    {@render ctx.iconOrTranslation(["add-object-property"])}
  </Button>
{/snippet}
<Template
  {value}
  {config}
  {errors}
  addButton={canExpand ? addButton : undefined}
>
  {#if schemaProperties !== undefined && value !== undefined}
    {#each schemaPropertiesOrder as property (property)}
      {@const isAdditional = isAdditionalProperty(schemaProperties, property)}
      {@const propSchemaDefinition = schemaProperties[property]!}
      {@const propSchema = typeof propSchemaDefinition === "boolean" ? {} : propSchemaDefinition}
      {@const propUiSchema =
        (isAdditional ? config.uiSchema.additionalProperties : config.uiSchema[property]) as UiSchema ?? {}}
      {@const propUiOptions = getUiOptions(ctx, propUiSchema)}
      <ObjectProperty
        {property}
        {isAdditional}
        bind:obj={value}
        bind:value={value[property]}
        config={{
          name: property,
          title: propUiOptions?.title ?? propSchema.title ?? property,
          schema: propSchema,
          uiSchema: propUiSchema,
          uiOptions: propUiOptions,
          idSchema: config.idSchema[property] ?? FAKE_ID_SCHEMA,
          required: requiredProperties.has(property),
        }}
      />
    {/each}
  {/if}
</Template>

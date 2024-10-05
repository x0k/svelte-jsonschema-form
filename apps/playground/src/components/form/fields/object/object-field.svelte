<script lang="ts">
  import { getFormContext } from "../../context";
  import {
    getDefaultValueForType,
    getSimpleSchemaType,
    isAdditionalProperty,
    isSchemaExpandable,
    isSchemaObjectValue,
    orderProperties,
  } from "../../schema";
  import type { UiSchema } from '../../ui-schema';
  import { FAKE_ID_SCHEMA } from '../../id-schema';
  import { getTemplate } from '../../templates';
  import { getComponent } from '../../component';
  import {
    getDefaultFormState,
    getErrors,
    getUiOptions,
    retrieveSchema,
  } from "../../utils";

  import { getField, type FieldProps } from "../model";
  import { isDisabledOrReadonly } from '../is-disabled-or-readonly';

  import { setObjectContext, type ObjectContext } from './context';
  import { generateNewKey } from './generate-new-object-key';
  import { createOriginalKeysOrder } from './create-original-keys-order';

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
  
  // TODO: Is it required? Seems like `root` field will always do the same thing
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
  
  const disabledOrReadOnly = $derived(isDisabledOrReadonly(ctx, config.uiOptions?.input))
  
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
    disabled={disabledOrReadOnly}
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
  />
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
      {@const propSchema = schemaProperties[property]}
      {@const propUiSchema =
        (isAdditional ? config.uiSchema.additionalProperties : config.uiSchema[property]) as UiSchema ?? {}}
      <ObjectProperty
        {property}
        {isAdditional}
        bind:obj={value}
        bind:value={value[property]}
        config={{
          name: property,
          title: property,
          schema: typeof propSchema === "boolean" ? {} : propSchema,
          uiSchema: propUiSchema,
          uiOptions: getUiOptions(ctx, propUiSchema),
          idSchema: config.idSchema[property] ?? FAKE_ID_SCHEMA,
          required: requiredProperties.has(property),
        }}
      />
    {/each}
  {/if}
</Template>

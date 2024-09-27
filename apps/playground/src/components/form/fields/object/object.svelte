<script lang="ts">
  import type { UiSchema } from '../../ui-schema';
  import { getFormContext } from "../../context";
  import {
    getDefaultValueForType,
    getSimpleSchemaType,
    isAdditionalProperty,
    isSchemaExpandable,
    isSchemaObjectValue,
    orderProperties,
  } from "../../schema";
  import {
    getComponent,
    getDefaultFormState,
    getFieldProps,
    getTemplate,
    getUiOptions,
    retrieveSchema,
  } from "../../utils";

  import type { FieldProps } from "../model";

  import ObjectProperty from './object-property.svelte';
  import { setObjectContext, type ObjectContext } from './context';
  import { generateNewKey } from './utils';

  const ctx = getFormContext();

  let {
    name,
    value = $bindable(),
    schema,
    uiSchema,
    idSchema,
    required,
  }: FieldProps<"object"> = $props();
  
  const uiOptions = $derived(getUiOptions(ctx, uiSchema))
  const newKeySeparator = $derived(uiOptions?.duplicateKeySuffixSeparator ?? "-")
  const objCtx: ObjectContext = {
    get value() {
      return value
    },
    set value(v) {
      value = v
    },
    get newKeySeparator() {
      return newKeySeparator
    }
  }
  setObjectContext(objCtx)
  
  // TODO: Is it required? Seems like `root` field will always do the same thing
  const retrievedSchema = $derived(retrieveSchema(ctx, schema, value))
  const requiredProperties = $derived(new Set(retrievedSchema.required));
  const schemaProperties = $derived(retrievedSchema.properties);
  const schemaPropertiesOrder = $derived(
    isSchemaObjectValue(schemaProperties)
    ? orderProperties(schemaProperties, uiOptions?.order)
    : []
  );
  const Template = $derived(getTemplate(ctx, "object", uiSchema));
  const Button = $derived(getComponent(ctx, "button", uiSchema));
  
  const { readonly, disabled } = $derived(getFieldProps(ctx, uiOptions))

  const schemaAdditionalProperties = $derived(
    isSchemaObjectValue(retrievedSchema.additionalProperties) ? retrieveSchema(ctx, retrievedSchema.additionalProperties, value) : {}
  )
  const canExpand = $derived(uiOptions?.expandable !== false && isSchemaExpandable(retrievedSchema, value))
</script>

{#snippet addButton()}
  <Button
    type="object-property-add"
    disabled={disabled || readonly}
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
  {name}
  {value}
  schema={retrievedSchema}
  {uiSchema}
  {idSchema}
  {required}
  {uiOptions}
  addButton={canExpand ? addButton : undefined}
>
  {#if schemaProperties !== undefined && value !== undefined}
    {#each schemaPropertiesOrder as property (property)}
      {@const isAdditional = isAdditionalProperty(schemaProperties, property)}
      {@const propSchema = schemaProperties?.[property]}
      {@const propUiSchema =
        (isAdditional ? uiSchema.additionalProperties : uiSchema[property]) as UiSchema ?? {}}
      <ObjectProperty
        {property}
        {isAdditional}
        bind:value={value[property]}
        name={property}
        required={requiredProperties.has(property)}
        schema={propSchema === undefined || typeof propSchema === "boolean" ? {} : propSchema}
        uiSchema={propUiSchema}
        idSchema={idSchema[property]}
      />
    {/each}
  {/if}
</Template>

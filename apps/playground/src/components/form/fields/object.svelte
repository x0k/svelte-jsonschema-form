<script lang="ts">
  import type { UiSchema } from '../ui-schema';
  import { getFormContext } from "../context";
  import {
    getDefaultValueForType,
    getSimpleSchemaType,
    isAdditionalProperty,
    isSchemaExpandable,
    isSchemaObjectValue,
    orderProperties,
  } from "../schema";
  import {
    getComponent,
    getDefaultFormState,
    getField,
    getFieldProps,
    getTemplate,
    getUiOptions,
    retrieveSchema,
  } from "../utils";

  import type { FieldProps } from "./model";

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
  const Field = $derived(getField(ctx, "root", uiSchema));

  const { title, readonly, description, disabled } = $derived(getFieldProps(ctx, name, retrievedSchema, uiOptions))

  const schemaAdditionalProperties = $derived(
    isSchemaObjectValue(retrievedSchema.additionalProperties) ? retrieveSchema(ctx, retrievedSchema.additionalProperties, value) : {}
  )
  const canExpand = $derived(uiOptions?.expandable !== false && isSchemaExpandable(retrievedSchema, value))

  const newKeySeparator = $derived(uiOptions?.duplicateKeySuffixSeparator ?? "-")
  function generateNewKey(preferredKey: string) {
    let index = 0
    let newKey = preferredKey
    while(value && newKey in value) {
      newKey = `${preferredKey}${newKeySeparator}${++index}`
    }
    return newKey
  }
</script>

{#snippet addButton()}
  <Button
    type="add-object-property"
    disabled={disabled || readonly}
    onclick={(e) => {
      e.preventDefault();
      if (value === undefined) {
        console.warn("Object value is undefined")
        return
      }
      const newKey = generateNewKey("newKey")
      value[newKey] = getDefaultFormState(ctx, schemaAdditionalProperties, value)
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
  {title}
  {description}
  addButton={canExpand ? addButton : undefined}
>
  {#if schemaProperties !== undefined && value !== undefined}
    {#each schemaPropertiesOrder as property (property)}
      {@const isAdditional = isAdditionalProperty(schemaProperties, property)}
      {@const propSchema = schemaProperties?.[property]}
      {@const propUiSchema =
        (isAdditional ? uiSchema.additionalProperties : uiSchema[property]) as UiSchema ?? {}}
      <Field
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

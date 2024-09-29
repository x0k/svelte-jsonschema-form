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
    getDefaultFormState,
    retrieveSchema,
  } from "../../utils";

  import type { FieldProps } from "../model";
  import { isDisabledOrReadonly } from '../is-disabled-or-readonly'

  import ObjectProperty from './object-property.svelte';
  import { setObjectContext, type ObjectContext } from './context';
  import { generateNewKey } from './generate-new-object-key';
  import { getTemplate } from '../../templates';
  import { getComponent } from '../../component';

  const ctx = getFormContext();

  let {
    config,
    value = $bindable(),
  }: FieldProps<"object"> = $props();
  
  const newKeySeparator = $derived(config.uiOptions?.duplicateKeySuffixSeparator ?? "-")
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
  const retrievedSchema = $derived(retrieveSchema(ctx, config.schema, value))
  const requiredProperties = $derived(new Set(retrievedSchema.required));
  const schemaProperties = $derived(retrievedSchema.properties);
  const schemaPropertiesOrder = $derived(
    isSchemaObjectValue(schemaProperties)
    ? orderProperties(schemaProperties, config.uiOptions?.order)
    : []
  );
  const Template = $derived(getTemplate(ctx, "object", config));
  const Button = $derived(getComponent(ctx, "button", config));
  
  const disabledOrReadOnly = $derived(isDisabledOrReadonly(ctx, config.uiOptions?.input))

  const schemaAdditionalProperties = $derived(
    isSchemaObjectValue(retrievedSchema.additionalProperties) ? retrieveSchema(ctx, retrievedSchema.additionalProperties, value) : {}
  )
  const canExpand = $derived(config.uiOptions?.expandable !== false && isSchemaExpandable(retrievedSchema, value))
</script>

{#snippet addButton()}
  <Button
    type="object-property-add"
    disabled={disabledOrReadOnly}
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
  addButton={canExpand ? addButton : undefined}
>
  {#if schemaProperties !== undefined && value !== undefined}
    {#each schemaPropertiesOrder as property (property)}
      {@const isAdditional = isAdditionalProperty(schemaProperties, property)}
      {@const propSchema = schemaProperties?.[property]}
      {@const propUiSchema =
        (isAdditional ? config.uiSchema.additionalProperties : config.uiSchema[property]) as UiSchema ?? {}}
      <ObjectProperty
        {property}
        {isAdditional}
        bind:value={value[property]}
        name={property}
        required={requiredProperties.has(property)}
        schema={propSchema === undefined || typeof propSchema === "boolean" ? {} : propSchema}
        uiSchema={propUiSchema}
        idSchema={config.idSchema[property]}
      />
    {/each}
  {/if}
</Template>

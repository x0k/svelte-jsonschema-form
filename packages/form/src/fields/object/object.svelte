<script lang="ts">
  import { untrack } from "svelte";

  import {
    getDefaultValueForType,
    getSimpleSchemaType,
    isAdditionalProperty,
    isSchemaDeepEqual,
    isSchemaExpandable,
    isSchemaObjectValue,
    orderProperties,
    type Schema,
    type SchemaObjectValue,
  } from "@/core/index.js";
  import {
    Text,
    type UiSchema,
    getComponent,
    getDefaultFieldState,
    getErrors,
    getUiOptions,
    retrieveSchema,
    getFormContext,
    validateField,
    AFTER_SUBMITTED,
    ON_OBJECT_CHANGE,
    createChildId,
    type ComponentProps,
    validateAdditionalPropertyKey,
  } from "@/form/index.js";

  import { setObjectContext, type ObjectContext } from "./context.js";
  import { generateNewKey } from "./generate-new-object-key.js";
  import { createOriginalKeysOrder } from "./create-original-keys-order.js";

  const ctx = getFormContext();

  let { config, value = $bindable() }: ComponentProps["objectField"] = $props();
  const newKeyPrefix = $derived(
    config.uiOptions?.additionalPropertyKeyPrefix ?? "newKey"
  );
  const newKeySeparator = $derived(
    config.uiOptions?.additionalPropertyKeySeparator ?? "-"
  );

  function validate() {
    const m = ctx.fieldsValidationMode;
    if (!(m & ON_OBJECT_CHANGE) || (m & AFTER_SUBMITTED && !ctx.isSubmitted)) {
      return;
    }
    validateField(ctx, config, value);
  }
  const objCtx: ObjectContext = {
    addProperty() {
      if (value === undefined) {
        return;
      }
      const newKey = generateNewKey(newKeyPrefix, newKeySeparator, value);
      value[newKey] =
        getDefaultFieldState(ctx, schemaAdditionalProperties, undefined) ??
        getDefaultValueForType(getSimpleSchemaType(schemaAdditionalProperties));
      validate();
    },
    removeProperty(prop) {
      if (value === undefined) {
        return;
      }
      delete value[prop];
      validate();
    },
    renameProperty(oldProp, newProp, fieldConfig) {
      if (value === undefined) {
        return;
      }
      const newKey = generateNewKey(newProp, newKeySeparator, value);
      if (!validateAdditionalPropertyKey(ctx, config, newKey, fieldConfig)) {
        return;
      }
      value[newKey] = value[oldProp];
      delete value[oldProp];
      validate();
    },
  };
  setObjectContext(objCtx);

  // NOTE: This is required for computing a schema which will include all additional properties
  //       in the `properties` field with the `ADDITIONAL_PROPERTY_FLAG` flag and
  //       `dependencies` resolution.
  const retrievedSchema = $derived(retrieveSchema(ctx, config.schema, value));
  const requiredProperties = $derived(new Set(retrievedSchema.required));

  let lastSchemaProperties: Schema["properties"] = undefined;
  const schemaProperties = $derived.by(() => {
    if (!isSchemaDeepEqual(lastSchemaProperties, retrievedSchema.properties)) {
      lastSchemaProperties = $state.snapshot(retrievedSchema.properties);
    }
    return lastSchemaProperties;
  });
  // This code should populate `defaults` for properties from `dependencies` before new `fields`
  // will populate their `defaults`.
  $effect.pre(() => {
    schemaProperties;
    untrack(() => {
      value = getDefaultFieldState(
        ctx,
        retrievedSchema,
        value
      ) as SchemaObjectValue;
    });
  });

  const schemaPropertiesOrder = $derived(
    isSchemaObjectValue(schemaProperties)
      ? orderProperties(
          schemaProperties,
          config.uiOptions?.order ?? createOriginalKeysOrder(schemaProperties)
        )
      : []
  );

  const ObjectProperty = $derived(
    getComponent(ctx, "objectPropertyField", config)
  );
  const Template = $derived(getComponent(ctx, "objectTemplate", config));
  const Button = $derived(getComponent(ctx, "button", config));

  const schemaAdditionalProperties = $derived(
    isSchemaObjectValue(retrievedSchema.additionalProperties)
      ? retrieveSchema(ctx, retrievedSchema.additionalProperties, value)
      : {}
  );
  const canExpand = $derived(
    config.uiOptions?.expandable !== false &&
      isSchemaExpandable(retrievedSchema, value)
  );
  const errors = $derived(getErrors(ctx, config.id));
</script>

{#snippet addButton()}
  <Button
    type="object-property-add"
    {config}
    {errors}
    disabled={false}
    onclick={() => {
      objCtx.addProperty();
    }}
  >
    <Text {config} id="add-object-property" />
  </Button>
{/snippet}
<Template
  type="template"
  {value}
  {config}
  {errors}
  addButton={canExpand ? addButton : undefined}
>
  {#if schemaProperties !== undefined && value !== undefined}
    {#each schemaPropertiesOrder as property (property)}
      {@const isAdditional = isAdditionalProperty(schemaProperties, property)}
      {@const propSchemaDefinition = schemaProperties[property] ?? false}
      {@const propSchema =
        typeof propSchemaDefinition === "boolean" ? {} : propSchemaDefinition}
      {@const propUiSchema =
        ((isAdditional
          ? config.uiSchema.additionalProperties
          : config.uiSchema[property]) as UiSchema) ?? {}}
      {@const propUiOptions = getUiOptions(ctx, propUiSchema)}
      <ObjectProperty
        type="field"
        {property}
        {isAdditional}
        bind:value={value[property]}
        config={{
          id: createChildId(config.id, property, ctx),
          name: property,
          title: propUiOptions?.title ?? propSchema.title ?? property,
          schema: propSchema,
          uiSchema: propUiSchema,
          uiOptions: propUiOptions,
          required: requiredProperties.has(property),
        }}
      />
    {/each}
  {/if}
</Template>

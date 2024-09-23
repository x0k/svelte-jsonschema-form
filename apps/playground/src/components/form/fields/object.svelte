<script lang="ts">
  import type { UiSchema } from '../ui-schema';
  import { getFormContext } from "../context";
  import {
    ADDITIONAL_PROPERTY_FLAG,
    isSchemaObjectValue,
    orderProperties,
  } from "../schema";
  import {
  canExpand,
    getComponent,
    getField,
    getTemplate,
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
  const requiredProperties = $derived(new Set(schema.required));
  const schemaProperties = $derived(schema.properties);
  const schemaPropertiesOrder = $derived(
    isSchemaObjectValue(schemaProperties)
      ? orderProperties(schemaProperties, uiSchema["ui:options"]?.order)
      : []
  );
  const Template = $derived(getTemplate(ctx, "object", uiSchema));
  const Title = $derived(getComponent(ctx, "title", uiSchema));
  const Description = $derived(getComponent(ctx, "description", uiSchema));
  const Button = $derived(getComponent(ctx, "button", uiSchema));
  const Field = $derived(getField(ctx, "root", uiSchema));

  let proxyValue = $state(value ?? {});

  $effect(() => {
    value = $state.snapshot(proxyValue);
  })

  function isPropertyAdditional(property: string) {
    if (schemaProperties === undefined) {
      return false;
    }
    const propertySchema = schemaProperties[property];
    if (typeof propertySchema === "boolean") {
      return false;
    }
    return ADDITIONAL_PROPERTY_FLAG in propertySchema;
  }

  const label = $derived(
    uiSchema["ui:options"]?.title ?? schema.title ?? name
  )
  const desc = $derived(uiSchema["ui:options"]?.description ?? schema.description)
</script>

{#snippet title()}
  <Title title={label} />
{/snippet}
{#snippet description()}
  <Description description={desc} />
{/snippet}
{#snippet addButton()}
  <Button type="add" />
{/snippet}
<Template
  {name}
  {value}
  {schema}
  {uiSchema}
  {idSchema}
  {required}
  {title}
  description={desc ? description : undefined}
  addButton={canExpand(ctx, schema, uiSchema, proxyValue) ? addButton : undefined}
>
  {#each schemaPropertiesOrder as property (property)}
    {@const isAdditional = isPropertyAdditional(property)}
    {@const propUiSchema =
      (isAdditional ? uiSchema.additionalProperties : uiSchema[property]) as UiSchema ?? {}}
    <Field
      bind:value={proxyValue[property]}
      name={property}
      required={requiredProperties.has(property)}
      schema={schemaProperties?.[property] ?? {}}
      uiSchema={propUiSchema}
      idSchema={idSchema[property] ?? {}}
    />
  {/each}
</Template>

<script lang="ts">
  import type { UiSchema } from '../ui-schema';
  import { getFormContext } from "../context";
  import {
    isAdditionalProperty,
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

  const label = $derived(
    uiSchema["ui:options"]?.title ?? schema.title ?? name
  )
  const desc = $derived(uiSchema["ui:options"]?.description ?? schema.description)
</script>

{#snippet title()}
  <Title title={label} />
{/snippet}
{#snippet description()}
  <Description description={desc!} />
{/snippet}
{#snippet addButton()}
  <Button type="add-object-property" />
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
  addButton={canExpand(ctx, schema, uiSchema, value) ? addButton : undefined}
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

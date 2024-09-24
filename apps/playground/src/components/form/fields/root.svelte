<script lang="ts">
  import { getFormContext } from "../context";
  import { getSimpleSchemaType, ID_KEY, mergeSchemaObjects } from "../schema";
  import { getComponent, getField, toIdSchema } from "../utils";

  import type { FieldProps } from "./model";

  const ctx = getFormContext();

  let {
    name,
    value = $bindable(),
    schema,
    uiSchema,
    idSchema,
    required,
  }: FieldProps<"root"> = $props();

  const Layout = $derived(getComponent(ctx, "layout", uiSchema));
  const schemaType = $derived(getSimpleSchemaType(schema));
  const Field = $derived(
    schemaType === "null" && (schema.anyOf || schema.oneOf)
      ? null
      : getField(ctx, schemaType, uiSchema)
  );
  const fieldIdSchema = $derived.by(() => {
    const nextIdSchema = toIdSchema(ctx, schema, idSchema?.[ID_KEY], value);
    return idSchema ? mergeSchemaObjects(nextIdSchema, idSchema) : nextIdSchema;
  });
</script>

<Layout type="root-field">
  {#if Field}
    <Field
      bind:value
      {name}
      {required}
      {schema}
      {uiSchema}
      idSchema={fieldIdSchema}
    />
  {/if}
</Layout>

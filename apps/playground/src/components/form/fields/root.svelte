<script lang="ts">
  import { getFormContext } from "../context";
  import { getSimpleSchemaType, ID_KEY, mergeObjects } from "../schema";
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
  const fieldIdSchema = $derived(
    mergeObjects(toIdSchema(ctx, schema, idSchema[ID_KEY], value), idSchema)
  );
</script>

<Layout type="root-field">
  {#if Field}
    <Field
      {name}
      {required}
      bind:value
      {schema}
      {uiSchema}
      idSchema={fieldIdSchema}
    />
  {/if}
</Layout>

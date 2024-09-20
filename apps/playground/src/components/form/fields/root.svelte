<script lang="ts">
  import merge from 'deepmerge';
  import { getFormContext } from "../context";
  import { getSimpleSchemaType, ID_KEY } from "../schema";
  import { getComponent, getField, toIdSchema } from "../utils";

  import type { FieldProps, FieldValue } from "./model";

  const ctx = getFormContext();

  let { value = $bindable(), schema, uiSchema, idSchema }: FieldProps<"root"> = $props();

  const Layout = $derived(getComponent(ctx, "layout", uiSchema));
  const schemaType = $derived(getSimpleSchemaType(schema));
  const Field = $derived(
    schemaType === "null" && (schema.anyOf || schema.oneOf)
      ? null
      : getField(ctx, schemaType, uiSchema)
  );
  const fieldIdSchema = $derived(
    merge(
      toIdSchema(ctx, schema, idSchema[ID_KEY], value),
      idSchema
    )
  )
</script>

<Layout type="root-field">
  {#if Field}
    <Field bind:value={value as FieldValue[typeof schemaType]} {schema} {uiSchema} idSchema={fieldIdSchema} />
  {/if}
</Layout>

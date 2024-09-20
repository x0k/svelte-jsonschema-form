<script lang="ts">
  import { getFormContext } from "../context";
  import { getSimpleSchemaType } from "../schema";
  import { getComponent, getField } from "../utils";

  import type { FieldProps, FieldValue } from "./model";

  const ctx = getFormContext();

  let { value = $bindable(), schema, uiSchema }: FieldProps<"root"> = $props();

  const Layout = $derived(getComponent(ctx, "layout", uiSchema));
  const schemaType = $derived(getSimpleSchemaType(schema));
  const Field = $derived(
    schemaType === "null" && (schema.anyOf || schema.oneOf)
      ? null
      : getField(ctx, schemaType, uiSchema)
  );
</script>

<Layout type="root-field">
  {#if Field}
    <Field bind:value={value as FieldValue[typeof schemaType]} {schema} {uiSchema} />
  {/if}
</Layout>

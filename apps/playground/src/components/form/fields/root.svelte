<script lang="ts" generics="T">
  import { getFormContext } from "../context";
  import { getSimpleSchemaType } from "../schema";
  import { getComponent, getField } from "../utils";

  import type { CommonProps, FieldValue } from "./model";

  const ctx = getFormContext<T>();

  let { value = $bindable(), schema, uiSchema }: CommonProps<T> = $props();

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

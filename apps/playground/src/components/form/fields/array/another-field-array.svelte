<script lang="ts">
  import { getFormContext } from "../../context";
  import { isSchemaObjectValue, type Schema, type SchemaArrayValue } from "../../schema";

  import { getField } from "../model";

  import { getArrayContext } from "./context";

  let { field, value = $bindable() }: { field: "enum" | "file", value: SchemaArrayValue | undefined } = $props()

  const ctx = getFormContext();
  const arrayCtx = getArrayContext();

  const Field = $derived(getField(ctx, field, arrayCtx.config));

  const schemaItems: Schema = $derived(
    isSchemaObjectValue(arrayCtx.config.schema.items)
      ? arrayCtx.config.schema.items
      : {}
  );
</script>

<Field
  multiple
  bind:value
  config={{
    ...arrayCtx.config,
    schema: schemaItems,
  }}
/>

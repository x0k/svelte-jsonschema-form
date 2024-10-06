<script lang="ts">
  import { isSchemaObjectValue, type Schema } from "@/core/schema";

  import { getFormContext } from "../../context";

  import { getField, type FieldProps } from "../model";

  let {
    field,
    value = $bindable(),
    config,
  }: FieldProps<"anotherFieldArray"> = $props();

  const ctx = getFormContext();

  const Field = $derived(getField(ctx, field, config));

  const schemaItems: Schema = $derived(
    isSchemaObjectValue(config.schema.items) ? config.schema.items : {}
  );
</script>

<Field
  multiple
  bind:value
  config={{
    ...config,
    schema: schemaItems,
  }}
/>

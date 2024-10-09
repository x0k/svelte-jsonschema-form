<script lang="ts">
  import { isSchemaObjectValue, type Schema } from "@/core/schema/index.js";

  import { getFormContext } from "../../context.js";

  import { getField, type FieldProps } from "../model.js";

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

<script lang="ts">
  import { isSchemaObjectValue, type Schema } from "@/core/index.js";

  import { type FieldProps, getFormContext, getField } from "@/form/index.js";

  let {
    field,
    value = $bindable(),
    config,
  }: FieldProps<"anotherFieldArray"> = $props();

  const ctx = getFormContext();

  const Field = $derived(getField(ctx, field, config));

  const itemSchema: Schema = $derived(
    isSchemaObjectValue(config.schema.items) ? config.schema.items : {}
  );
</script>

<Field bind:value {config} {itemSchema} />

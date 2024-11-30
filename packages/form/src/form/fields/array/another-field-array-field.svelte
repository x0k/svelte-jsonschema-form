<script lang="ts">
  import { isSchemaObjectValue, type Schema } from "@/core/index.js";

  import { getFormContext, getField } from "../../context/index.js";

  import type { FieldProps } from "../model.js";

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
  multiple={schemaItems}
  bind:value
  config={config}
/>

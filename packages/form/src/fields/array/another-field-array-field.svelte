<script lang="ts">
  import { isSchemaObjectValue, type Schema } from "@/core/index.js";

  import { getComponent, getFormContext } from "@/form/index.js";

  import type { FieldProps } from '../fields.js';

  let {
    field,
    value = $bindable(),
    config,
  }: FieldProps<"arrayLike"> = $props();

  const ctx = getFormContext();

  const Field = $derived(getComponent(ctx, field, config));

  const itemSchema: Schema = $derived(
    isSchemaObjectValue(config.schema.items) ? config.schema.items : {}
  );
</script>

<Field bind:value {config} {itemSchema} />

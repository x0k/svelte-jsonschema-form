<script lang="ts">
  import type { SchemaValue } from "@/core/schema.js";

  import {
    retrieveSchema,
    getFormContext,
    makeIdSchema,
    getUiOptions,
    getField,
  } from "./context/index.js";
  import type { Config } from './config.js';

  let { value = $bindable() }: { value: SchemaValue | undefined } = $props();

  const ctx = getFormContext();

  const retrievedSchema = $derived(
    retrieveSchema(ctx, ctx.schema, value)
  );
  const idSchema = $derived(
    makeIdSchema(
      ctx,
      retrievedSchema,
      ctx.uiSchema["ui:rootFieldId"],
      value
    )
  );
  const uiOptions = $derived(getUiOptions(ctx, ctx.uiSchema));
  const config: Config = $derived({
    name: "",
    title: uiOptions?.title ?? retrievedSchema.title ?? "",
    schema: retrievedSchema,
    uiSchema: ctx.uiSchema,
    idSchema,
    uiOptions,
    required: false,
  })

  const Field = $derived(getField(ctx, "root", config));
</script>

<Field bind:value {config} />

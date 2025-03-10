<script lang="ts">
  import type { Config } from "./config.js";
  import {
    retrieveSchema,
    getFormContext,
    getUiOptions,
    getFieldComponent,
  } from "./context/index.js";

  const ctx = getFormContext();

  const retrievedSchema = $derived(retrieveSchema(ctx, ctx.schema, ctx.value));
  const uiOptions = $derived(getUiOptions(ctx, ctx.uiSchema));
  const config: Config = $derived({
    id: ctx.rootId,
    name: "",
    title: uiOptions?.title ?? retrievedSchema.title ?? "",
    schema: retrievedSchema,
    uiSchema: ctx.uiSchema,
    uiOptions,
    required: false,
  });

  const Field = $derived(getFieldComponent(ctx, config));
</script>

<!-- svelte-ignore ownership_invalid_binding -->
<Field bind:value={ctx.value as undefined} {config} />

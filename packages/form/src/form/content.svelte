<script lang="ts">
  import type { Config } from "./config.js";
  import {
    retrieveSchema,
    getFormContext,
    getFieldComponent,
  } from "./context/index.js";

  const ctx = getFormContext();

  const retrievedSchema = $derived(retrieveSchema(ctx, ctx.schema, ctx.value));
  const config: Config = $derived({
    id: ctx.rootId,
    name: "",
    title: ctx.uiOptions?.title ?? retrievedSchema.title ?? "",
    schema: retrievedSchema,
    uiSchema: ctx.uiSchema,
    uiOptions: ctx.uiOptions,
    required: false,
  });

  const Field = $derived(getFieldComponent(ctx, config));
  // Forces svelte to update component
  $effect(() => {
    Field;
  });
</script>

<Field type="field" bind:value={ctx.value as undefined} {config} />

<script lang="ts">
  import type { Config } from "./config.js";
  import {
    retrieveSchema,
    getFormContext,
    getFieldComponent,
    retrieveUiOption,
  } from "./context/index.js";

  const ctx = getFormContext();

  const retrievedSchema = $derived(retrieveSchema(ctx, ctx.schema, ctx.value));
  const config: Config = $derived({
    id: ctx.rootId,
    name: "",
    _title: retrievedSchema.title ?? "",
    schema: retrievedSchema,
    uiSchema: ctx.uiSchema,
    required: false,
  });

  const Field = $derived(getFieldComponent(ctx, config));
  // Forces svelte to update component
  $effect(() => {
    Field;
  });
</script>

<Field
  type="field"
  bind:value={ctx.value as undefined}
  {config}
  uiOption={(opt) => retrieveUiOption(ctx, config, opt)}
/>

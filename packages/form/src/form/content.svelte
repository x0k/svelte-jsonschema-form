<script lang="ts">
  import type { Config } from "./config.js";
  import {
    retrieveSchema,
    getFormContext,
    getFieldComponent,
    retrieveUiOption,
    uiTitleOption,
    retrieveTranslate,
  } from "./context/index.js";

  const ctx = getFormContext();

  const retrievedSchema = $derived(retrieveSchema(ctx, ctx.schema, ctx.value));
  const config: Config = $derived({
    id: ctx.rootId,
    title: uiTitleOption(ctx, ctx.uiSchema) ?? retrievedSchema.title ?? "",
    schema: retrievedSchema,
    uiSchema: ctx.uiSchema,
    required: false,
  });

  const Field = $derived(getFieldComponent(ctx, config));
</script>

<Field
  type="field"
  bind:value={ctx.value as undefined}
  {config}
  uiOption={(opt) => retrieveUiOption(ctx, config, opt)}
  translate={retrieveTranslate(ctx, config)}
/>

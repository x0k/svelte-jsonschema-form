<script lang="ts">
  import type { Schema } from "@/core/index.js";

  import type { Config } from "./config.js";
  import {
    retrieveSchema,
    getFormContext,
    getFieldComponent,
    retrieveUiOption,
    uiTitleOption,
    retrieveTranslate,
  } from "./context/index.js";

  interface Props {
    name?: string;
    required?: boolean;
    schema?: Schema;
  }

  const { name = "", required = false, schema }: Props = $props();

  const ctx = getFormContext();

  const retrievedSchema = $derived(
    retrieveSchema(ctx, schema ?? ctx.schema, ctx.value)
  );
  const config: Config = $derived({
    id: ctx.rootId,
    name,
    title: uiTitleOption(ctx, ctx.uiSchema) ?? retrievedSchema.title ?? "",
    schema: retrievedSchema,
    uiSchema: ctx.uiSchema,
    required,
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
  translate={retrieveTranslate(ctx, config)}
/>

<script lang="ts">
  import {
    retrieveSchema,
    getFormContext,
    makeIdSchema,
    getUiOptions,
    getField,
  } from "./context/index.js";
  import type { Config } from "./config.js";
  import type { FormInternals } from "./create-form.svelte.js";

  const { form }: { form: FormInternals } = $props();

  const ctx = getFormContext();

  const retrievedSchema = $derived(
    retrieveSchema(ctx, ctx.schema, form.formValue)
  );
  const idSchema = $derived(
    makeIdSchema(
      ctx,
      retrievedSchema,
      ctx.uiSchema["ui:rootFieldId"],
      form.formValue
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
  });

  const Field = $derived(getField(ctx, "root", config));
</script>

<!-- svelte-ignore ownership_invalid_binding -->
<Field bind:value={form.formValue} {config} />

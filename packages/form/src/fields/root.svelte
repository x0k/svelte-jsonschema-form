<script lang="ts">
  import {
    ANY_OF_KEY,
    getSimpleSchemaType,
    isFileSchema,
  } from "@/core/index.js";

  import {
    getComponent,
    getErrors,
    isSelect,
    getFormContext,
    type ComponentProps,
  } from "@/form/index.js";

  const ctx = getFormContext();

  let { config, value = $bindable() }: ComponentProps["rootField"] = $props();

  const Layout = $derived(getComponent(ctx, "layout", config));
  const schemaType = $derived(getSimpleSchemaType(config.schema));
  const combinationKey = $derived(
    config.schema.anyOf !== undefined
      ? ANY_OF_KEY
      : config.schema.oneOf !== undefined
        ? "oneOf"
        : undefined
  );
  const isSelectSchema = $derived(isSelect(ctx, config.schema));
  const Field = $derived(
    combinationKey && schemaType === "null"
      ? null
      : getComponent(
          ctx,
          isSelectSchema
            ? "enumField"
            : isFileSchema(config.schema)
              ? "fileField"
              : `${schemaType}Field`,
          config
        )
  );
  const MultiField = $derived(getComponent(ctx, "multiField", config));

  const errors = $derived(getErrors(ctx, config.id));
</script>

<Layout {errors} type="root-field" {config}>
  {#if Field}
    <Field bind:value={value as undefined} {config} />
  {/if}
  {#if combinationKey && !isSelectSchema}
    <MultiField {combinationKey} bind:value {config} />
  {/if}
</Layout>

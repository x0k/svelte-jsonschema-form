<script lang="ts">
  import {
    ANY_OF_KEY,
    getSimpleSchemaType,
    ID_KEY,
    isFileSchema,
    mergeSchemaObjects,
  } from "@/core/index.js";

  import {
    FAKE_ID_SCHEMA,
    type FieldProps,
    getComponent,
    getField,
    getErrors,
    isSelect,
    makeIdSchema,
    getFormContext,
  } from "@/form/index.js";

  const ctx = getFormContext();

  let { config, value = $bindable() }: FieldProps<"root"> = $props();

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
      : getField(
          ctx,
          isSelectSchema
            ? "enum"
            : isFileSchema(config.schema)
              ? "file"
              : schemaType,
          config
        )
  );
  const MultiField = $derived(getField(ctx, "multi", config));
  const fieldIdSchema = $derived.by(() => {
    const isFake = config.idSchema === FAKE_ID_SCHEMA;
    const nextIdSchema = makeIdSchema(
      ctx,
      config.schema,
      isFake ? undefined : config.idSchema[ID_KEY],
      value
    );
    return isFake
      ? nextIdSchema
      : mergeSchemaObjects(nextIdSchema, config.idSchema);
  });

  const errors = $derived(getErrors(ctx, fieldIdSchema));
</script>

<Layout {errors} type="root-field" {config}>
  {#if Field}
    <Field
      bind:value
      config={{
        ...config,
        idSchema: fieldIdSchema,
      }}
    />
  {/if}
  {#if combinationKey && !isSelectSchema}
    <MultiField
      {combinationKey}
      bind:value
      config={{
        ...config,
        idSchema: fieldIdSchema,
      }}
    />
  {/if}
</Layout>

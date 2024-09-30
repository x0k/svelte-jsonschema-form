<script lang="ts">
  import { getComponent } from "../component";
  import { getFormContext } from "../context";
  import { FAKE_ID_SCHEMA } from "../id-schema";
  import {
    getSimpleSchemaType,
    ID_KEY,
    isFileSchema,
    mergeSchemaObjects,
  } from "../schema";
  import { isSelect, toIdSchema } from "../utils";

  import { getField, type FieldProps } from "./model";

  const ctx = getFormContext();

  let { config, value = $bindable() }: FieldProps<"root"> = $props();

  const Layout = $derived(getComponent(ctx, "layout", config));
  const schemaType = $derived(getSimpleSchemaType(config.schema));
  const Field = $derived(
    schemaType === "null" && (config.schema.anyOf || config.schema.oneOf)
      ? null
      : getField(
          ctx,
          isSelect(ctx, config.schema)
            ? "enum"
            : isFileSchema(config.schema)
              ? "file"
              : schemaType,
          config
        )
  );
  const fieldIdSchema = $derived.by(() => {
    const isFake = config.idSchema === FAKE_ID_SCHEMA;
    const nextIdSchema = toIdSchema(
      ctx,
      config.schema,
      isFake ? undefined : config.idSchema[ID_KEY],
      value
    );
    return isFake
      ? nextIdSchema
      : mergeSchemaObjects(nextIdSchema, config.idSchema);
  });
</script>

<Layout type="root-field" {config}>
  {#if Field}
    <Field
      bind:value
      config={{
        ...config,
        idSchema: fieldIdSchema,
      }}
    />
  {/if}
</Layout>

<script lang="ts" module>
  import { EMPTY_PATH, type SchemaValue } from "@/core/index.js";

  import type { Config } from "./config.js";

  declare module "./theme.js" {
    interface Components {
      rootField: {
        value: SchemaValue | undefined
        config: Config
      }
    }

    interface ComponentBindings {
      rootField: "value";
    }
  }
</script>

<script lang="ts">
  import {
    retrieveSchema,
    getFormContext,
    getUiOptions,
    getComponent,
    createId,
  } from "./context/index.js";

  const ctx = getFormContext();

  const retrievedSchema = $derived(retrieveSchema(ctx, ctx.schema, ctx.value));
  const uiOptions = $derived(getUiOptions(ctx, ctx.uiSchema));
  const config: Config = $derived({
    id: createId(ctx, EMPTY_PATH),
    name: "",
    title: uiOptions?.title ?? retrievedSchema.title ?? "",
    schema: retrievedSchema,
    uiSchema: ctx.uiSchema,
    uiOptions,
    required: false,
  });

  const Field = $derived(getComponent(ctx, "rootField", config));
</script>

<!-- svelte-ignore ownership_invalid_binding -->
<Field bind:value={ctx.value} {config} />

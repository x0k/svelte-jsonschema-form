<script lang="ts">
  import { getFormContext } from "../../context";
  import { isSchemaObjectValue, type Schema } from "../../schema";

  import { getField } from "../model";

  import { getArrayContext } from "./context";

  const ctx = getFormContext();
  const arrayCtx = getArrayContext();

  const Field = $derived(getField(ctx, "enum", arrayCtx.config));

  const schemaItems: Schema = $derived(
    isSchemaObjectValue(arrayCtx.config.schema.items)
      ? arrayCtx.config.schema.items
      : {}
  );
</script>

<Field
  multiple
  bind:value={arrayCtx.value}
  config={{
    ...arrayCtx.config,
    schema: schemaItems,
  }}
/>

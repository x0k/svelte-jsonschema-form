<script lang="ts">
  import { getFormContext } from "../../context";
  import { isSchemaObjectValue, type Schema } from "../../schema";
  import { getField } from "../../utils";

  import { getArrayContext } from "./context";

  const ctx = getFormContext();
  const arrayCtx = getArrayContext();

  const Field = $derived(getField(ctx, "enum", arrayCtx.uiSchema));

  const schemaItems: Schema = $derived(
    isSchemaObjectValue(arrayCtx.schema.items) ? arrayCtx.schema.items : {}
  );
  $inspect(schemaItems)
</script>

<Field
  multiple
  name={arrayCtx.name}
  bind:value={arrayCtx.value}
  schema={schemaItems}
  uiSchema={arrayCtx.uiSchema}
  idSchema={arrayCtx.idSchema}
  required={arrayCtx.required}
/>

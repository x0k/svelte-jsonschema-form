<script lang="ts">
  import { getFormContext } from "../../context";
  import { isSchemaObjectValue, type Schema } from "../../schema";
  import {
    getArrayItemSchemaId,
    getTemplate,
    retrieveSchema,
  } from "../../utils";

  import { getArrayContext } from "./context";
  import ArrayItem from "./array-item.svelte";
  import type { UiSchema } from "../../ui-schema";

  const ctx = getFormContext();
  const arrayCtx = getArrayContext();

  const Template = $derived(getTemplate(ctx, "array", arrayCtx.uiSchema));

  const schemaItems: Schema = $derived(
    // NOTE: Fixed array is covered in another component
    isSchemaObjectValue(arrayCtx.schema.items) ? arrayCtx.schema.items : {}
  );
  const itemUiSchema: UiSchema = $derived(
    isSchemaObjectValue(arrayCtx.uiSchema.items) ? arrayCtx.uiSchema.items : {}
  );
  // const itemsSchema = $derived(retrieveSchema(ctx, schemaItems, undefined));
</script>

<Template
  name={arrayCtx.name}
  value={arrayCtx.value}
  schema={arrayCtx.schema}
  uiSchema={arrayCtx.uiSchema}
  idSchema={arrayCtx.idSchema}
  required={arrayCtx.required}
>
  {#if arrayCtx.value}
    {#each arrayCtx.value as item, index}
      {@const itemSchema = retrieveSchema(ctx, schemaItems, item)}
      {@const itemIdSchema = getArrayItemSchemaId(
        ctx,
        arrayCtx.idSchema,
        itemSchema,
        index,
        item
      )}
      <ArrayItem />
    {/each}
  {/if}
</Template>

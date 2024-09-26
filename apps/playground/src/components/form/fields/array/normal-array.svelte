<script lang="ts">
  import { getFormContext } from "../../context";
  import {
    isSchemaNullable,
    isSchemaObjectValue,
    type Schema,
  } from "../../schema";
  import {
    getArrayItemSchemaId,
    getComponent,
    getDefaultFormState,
    getTemplate,
    retrieveSchema,
  } from "../../utils";

  import { getArrayContext } from "./context";
  import ArrayItem from "./array-item.svelte";
  import { getArrayItemName, makeHandler } from './utils';

  const ctx = getFormContext();
  const arrayCtx = getArrayContext();

  const Template = $derived(getTemplate(ctx, "array", arrayCtx.uiSchema));
  const Button = $derived(getComponent(ctx, "button", arrayCtx.uiSchema));

  const schemaItems: Schema = $derived(
    isSchemaObjectValue(arrayCtx.schema.items) ? arrayCtx.schema.items : {}
  );
  const itemUiSchema = $derived(
    arrayCtx.uiSchema.items !== undefined &&
      !Array.isArray(arrayCtx.uiSchema.items)
      ? arrayCtx.uiSchema.items
      : {}
  );
</script>

{#snippet addButton()}
  <Button
    type="array-item-add"
    disabled={arrayCtx.disabled || arrayCtx.readonly}
    onclick={makeHandler(arrayCtx, (arr) => {
      arr.push(getDefaultFormState(ctx, schemaItems, undefined))
    })}
  />
{/snippet}
<Template
  name={arrayCtx.name}
  title={arrayCtx.title}
  value={arrayCtx.value}
  schema={arrayCtx.schema}
  uiSchema={arrayCtx.uiSchema}
  idSchema={arrayCtx.idSchema}
  required={arrayCtx.required}
  description={arrayCtx.description}
  addButton={arrayCtx.canAdd ? addButton : undefined}
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
      <ArrayItem
        {index}
        name={getArrayItemName(arrayCtx, index)}
        bind:value={arrayCtx.value[index]}
        schema={itemSchema}
        uiSchema={itemUiSchema}
        idSchema={itemIdSchema}
        canRemove={true}
        canMoveUp={index > 0}
        canMoveDown={index < arrayCtx.value.length - 1}
        required={!isSchemaNullable(itemSchema)}
      />
    {/each}
  {/if}
</Template>

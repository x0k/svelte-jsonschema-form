<script lang="ts">
  import { getFormContext } from "../../context";
  import {
    isSchemaNullable,
    isSchemaObjectValue,
    type Schema,
  } from "../../schema";
  import { getComponent } from '../../component';
  import { getTemplate } from '../../templates';
  import {
    getDefaultFormState,
    getUiOptions,
    retrieveSchema,
  } from "../../utils";

  import { getArrayContext } from "./context";
  import ArrayItem from "./array-item.svelte";
  import { makeHandler } from './make-click-handler';
  import { getArrayItemName } from './get-array-item-name'
  import { getArrayItemSchemaId } from './get-array-item-schema-id'

  const ctx = getFormContext();
  const arrayCtx = getArrayContext();

  const Template = $derived(getTemplate(ctx, "array", arrayCtx.config));
  const Button = $derived(getComponent(ctx, "button", arrayCtx.config));

  const schemaItems: Schema = $derived(
    isSchemaObjectValue(arrayCtx.config.schema.items) ? arrayCtx.config.schema.items : {}
  );
  const itemUiSchema = $derived(
    arrayCtx.config.uiSchema.items !== undefined &&
      !Array.isArray(arrayCtx.config.uiSchema.items)
      ? arrayCtx.config.uiSchema.items
      : {}
  );
</script>

{#snippet addButton()}
  <Button
    type="array-item-add"
    disabled={arrayCtx.disabledOrReadonly}
    onclick={makeHandler(arrayCtx, (arr) => {
      arr.push(getDefaultFormState(ctx, schemaItems, undefined))
    })}
  />
{/snippet}
<Template
  config={arrayCtx.config}
  value={arrayCtx.value}
  addButton={arrayCtx.canAdd ? addButton : undefined}
>
  {#if arrayCtx.value}
    {#each arrayCtx.value as item, index}
      {@const itemSchema = retrieveSchema(ctx, schemaItems, item)}
      {@const itemIdSchema = getArrayItemSchemaId(
        ctx,
        arrayCtx.config.idSchema,
        itemSchema,
        index,
        item
      )}
      <ArrayItem
        {index}
        config={{
          name: getArrayItemName(arrayCtx, index),
          schema: itemSchema,
          uiSchema: itemUiSchema,
          uiOptions: getUiOptions(ctx, itemUiSchema),
          idSchema: itemIdSchema,
          required: !isSchemaNullable(itemSchema),
        }}
        bind:value={arrayCtx.value[index]}
        canRemove={true}
        canMoveUp={index > 0}
        canMoveDown={index < arrayCtx.value.length - 1}
      />
    {/each}
  {/if}
</Template>

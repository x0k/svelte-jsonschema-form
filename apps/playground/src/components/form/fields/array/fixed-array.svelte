<script lang="ts">
  import { getFormContext } from '../../context';
  import { isSchemaNullable, isSchemaObjectValue } from '../../schema';
  import { getArrayItemSchemaId, getComponent, getDefaultFormState, getTemplate, retrieveSchema } from '../../utils';
  
  import { getArrayContext } from './context';
  import ArrayItem from './array-item.svelte';
  import { getArrayItemName, makeHandler } from './utils';

  const ctx = getFormContext();
  const arrayCtx = getArrayContext();

  const Template = $derived(getTemplate(ctx, "array", arrayCtx.uiSchema));
  const Button = $derived(getComponent(ctx, "button", arrayCtx.uiSchema));

  const schemaItems = $derived(
    Array.isArray(arrayCtx.schema.items)
      ? arrayCtx.schema.items.map((item, i) => {
        if (typeof item === "boolean") {
          throw new Error("Invalid schema: items must be an array of schemas")
        }
        return retrieveSchema(ctx, item, arrayCtx.value?.[i])
      })
      : []
  )
  const schemaAdditionalItems = $derived(
    isSchemaObjectValue(arrayCtx.schema?.additionalItems)
      ? retrieveSchema(ctx, arrayCtx.schema.additionalItems, arrayCtx.value)
      : null
  )

  // TODO: Check that this code is needed and generation of default values is required
  // $effect(() => {
  //   if (arrayCtx.value === undefined) {
  //     arrayCtx.value = new Array(schemaItems.length)
  //     return
  //   }
  //   if (arrayCtx.value.length < schemaItems.length) {
  //     arrayCtx.value.push(...new Array(schemaItems.length - arrayCtx.value.length))
  //   }
  // })
  </script>

{#snippet addButton()}
  <Button
    type="add-array-item"
    disabled={arrayCtx.disabled || arrayCtx.readonly}
    onclick={makeHandler(arrayCtx, (arr) => {
      if (schemaAdditionalItems === null) {
        return
      }
      arr.push(getDefaultFormState(ctx, schemaAdditionalItems))
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
  addButton={arrayCtx.canAdd && schemaAdditionalItems ? addButton : undefined}
>
  {#if arrayCtx.value}
    {#each arrayCtx.value as item, index}
      {@const isAdditional = index >= schemaItems.length}
      {@const itemSchema = isAdditional && schemaAdditionalItems ? retrieveSchema(ctx, schemaAdditionalItems, item) : schemaItems[index]}
      {@const itemUiSchema = (isAdditional
        ? arrayCtx.uiSchema.additionalItems
        : Array.isArray(arrayCtx.uiSchema.items)
        ? arrayCtx.uiSchema.items[index]
        : arrayCtx.uiSchema.items
      ) ?? {}}
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
        canRemove={isAdditional}
        canMoveUp={index > schemaItems.length}
        canMoveDown={isAdditional && index < arrayCtx.value.length - 1}
        required={!isSchemaNullable(itemSchema)}
      />
    {/each}
  {/if}
</Template>

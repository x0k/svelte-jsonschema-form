<script lang="ts">
  import { getFormContext } from '../../context';
  import { isSchemaNullable, isSchemaObjectValue, type Schema, type SchemaArrayValue } from '../../schema';
  import { getComponent } from '../../component';
  import { getTemplate } from '../../templates';
  import { getDefaultFormState, getUiOptions, retrieveSchema } from '../../utils';
  
  import { getArrayContext } from './context';
  import ArrayItem from './array-item.svelte';
  import { makeHandler } from './make-click-handler';
  import { getArrayItemName, getFixedArrayItemTitle, getNormalArrayItemTitle } from './get-array-item-name'
  import { getArrayItemSchemaId } from './get-array-item-schema-id'

  let { value = $bindable() }: { value: SchemaArrayValue | undefined } = $props()

  const ctx = getFormContext();
  const arrayCtx = getArrayContext();
  $effect(() => {
    if (value === undefined) {
      value = new Array(schemaItems.length)
      return
    }
    if (value.length < schemaItems.length) {
      value.push(...new Array(schemaItems.length - value.length))
    }
  })

  const Template = $derived(getTemplate(ctx, "array", arrayCtx.config));
  const Button = $derived(getComponent(ctx, "button", arrayCtx.config));

  const schemaItems = $derived(
    Array.isArray(arrayCtx.config.schema.items)
      ? arrayCtx.config.schema.items.map((item, i) => {
        if (typeof item === "boolean") {
          throw new Error("Invalid schema: items must be an array of schemas")
        }
        return retrieveSchema(ctx, item, value?.[i])
      })
      : []
  )
  const schemaAdditionalItems: Schema | false = $derived(
    isSchemaObjectValue(arrayCtx.config.schema?.additionalItems)
      ? arrayCtx.config.schema.additionalItems
      : false
  )
</script>

{#snippet addButton()}
  <Button
    errors={arrayCtx.errors}
    config={arrayCtx.config}
    type="array-item-add"
    attributes={arrayCtx.config.uiOptions?.button}
    disabled={arrayCtx.disabledOrReadonly}
    onclick={makeHandler(() => {
      if (!schemaAdditionalItems || value === undefined) {
        return
      }
      value.push(getDefaultFormState(ctx, schemaAdditionalItems, undefined))
    })}
  />
{/snippet}
<Template
  value={value}
  config={arrayCtx.config}
  errors={arrayCtx.errors}
  addButton={arrayCtx.canAdd && schemaAdditionalItems ? addButton : undefined}
>
  {#if value}
    {#each value as item, index}
      {@const isAdditional = index >= schemaItems.length}
      {@const itemSchema = isAdditional && schemaAdditionalItems ? retrieveSchema(ctx, schemaAdditionalItems, item) : schemaItems[index]}
      {@const uiSchema = arrayCtx.config.uiSchema}
      {@const itemUiSchema = (isAdditional
        ? uiSchema.additionalItems
        : Array.isArray(uiSchema.items)
        ? uiSchema.items[index]
        : uiSchema.items
      ) ?? {}}
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
          title: getFixedArrayItemTitle(arrayCtx, index),
          schema: itemSchema,
          uiSchema: itemUiSchema,
          uiOptions: getUiOptions(ctx, itemUiSchema),
          idSchema: itemIdSchema,
          required: !isSchemaNullable(itemSchema),
        }}
        bind:arr={value}
        bind:value={value[index]}
        canRemove={isAdditional}
        canMoveUp={index > schemaItems.length}
        canMoveDown={isAdditional && index < value.length - 1}
      />
    {/each}
  {/if}
</Template>

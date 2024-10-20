<script lang="ts">
  import { isSchemaNullable, isSchemaObjectValue, type Schema } from '@/core/index.js';
  
  import {
    getComponent,
    getTemplate,
    getField,
    getDefaultFormState,
    getUiOptions,
    retrieveSchema,
    getFormContext
  } from '../../context/index.js';
  
  import type { FieldProps } from '../model.js';
  
  import { getArrayItemSchemaId, getArrayContext } from './context.js';
  import { getArrayItemName, getFixedArrayItemTitle } from './get-array-item-name.js'

  let { value = $bindable(), config }: FieldProps<"fixedArray"> = $props()

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

  const ArrayItem = $derived(getField(ctx, "arrayItem", config));
  const Template = $derived(getTemplate(ctx, "array", config));
  const Button = $derived(getComponent(ctx, "button", config));

  const schemaItems = $derived(
    Array.isArray(config.schema.items)
      ? config.schema.items.map((item, i) => {
        if (typeof item === "boolean") {
          throw new Error("Invalid schema: items must be an array of schemas")
        }
        return retrieveSchema(ctx, item, value?.[i])
      })
      : []
  )
  const schemaAdditionalItems: Schema | false = $derived(
    isSchemaObjectValue(config.schema?.additionalItems)
      ? config.schema.additionalItems
      : false
  )
</script>

{#snippet addButton()}
  <Button
    errors={arrayCtx.errors}
    {config}
    type="array-item-add"
    attributes={config.uiOptions?.button}
    disabled={arrayCtx.disabled}
    onclick={(e) => {
      e.preventDefault();
      if (!schemaAdditionalItems || value === undefined) {
        return
      }
      value.push(getDefaultFormState(ctx, schemaAdditionalItems, undefined))
    }}
  >
    {@render ctx.iconOrTranslation(["add-array-item"])}
  </Button>
{/snippet}
<Template
  value={value}
  {config}
  errors={arrayCtx.errors}
  addButton={arrayCtx.canAdd && schemaAdditionalItems ? addButton : undefined}
>
  {#if value}
    {#each value as item, index}
      {@const isAdditional = index >= schemaItems.length}
      {@const itemSchema = isAdditional && schemaAdditionalItems ? retrieveSchema(ctx, schemaAdditionalItems, item) : schemaItems[index]!}
      {@const uiSchema = config.uiSchema}
      {@const itemUiSchema = (isAdditional
        ? uiSchema.additionalItems
        : Array.isArray(uiSchema.items)
        ? uiSchema.items[index]
        : uiSchema.items
      ) ?? {}}
      {@const itemIdSchema = getArrayItemSchemaId(
        ctx,
        config.idSchema,
        itemSchema,
        index,
        item
      )}
      <ArrayItem
        {index}
        config={{
          name: getArrayItemName(config, index),
          title: getFixedArrayItemTitle(config, index),
          schema: itemSchema,
          uiSchema: itemUiSchema,
          uiOptions: getUiOptions(ctx, itemUiSchema),
          idSchema: itemIdSchema,
          required: !isSchemaNullable(itemSchema),
        }}
        bind:arr={value}
        bind:value={value[index]}
        canCopy={arrayCtx.copyable && isAdditional && arrayCtx.canAdd}
        canRemove={arrayCtx.removable && isAdditional}
        canMoveUp={arrayCtx.orderable && index > schemaItems.length}
        canMoveDown={arrayCtx.orderable && isAdditional && index < value.length - 1}
      />
    {/each}
  {/if}
</Template>

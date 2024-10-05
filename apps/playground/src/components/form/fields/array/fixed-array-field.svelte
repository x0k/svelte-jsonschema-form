<script lang="ts">
  import { getFormContext } from '../../context';
  import { isSchemaNullable, isSchemaObjectValue, type Schema } from '../../schema';
  import { getComponent } from '../../component';
  import { getTemplate } from '../../templates';
  import { getDefaultFormState, getUiOptions, retrieveSchema } from '../../utils';
  
  import type { FieldProps } from '../model';
  
  import { getArrayContext } from './context';
  import ArrayItem from './array-item.svelte';
  import { makeHandler } from './make-click-handler';
  import { getArrayItemName, getFixedArrayItemTitle } from './get-array-item-name'
  import { getArrayItemSchemaId } from './get-array-item-schema-id'

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
  {config}
  errors={arrayCtx.errors}
  addButton={arrayCtx.canAdd && schemaAdditionalItems ? addButton : undefined}
>
  {#if value}
    {#each value as item, index}
      {@const isAdditional = index >= schemaItems.length}
      {@const itemSchema = isAdditional && schemaAdditionalItems ? retrieveSchema(ctx, schemaAdditionalItems, item) : schemaItems[index]}
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
        canRemove={isAdditional}
        canMoveUp={index > schemaItems.length}
        canMoveDown={isAdditional && index < value.length - 1}
      />
    {/each}
  {/if}
</Template>

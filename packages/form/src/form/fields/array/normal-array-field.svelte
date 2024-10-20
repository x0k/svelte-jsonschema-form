<script lang="ts">
  import {
    isSchemaNullable,
    isSchemaObjectValue,
    type Schema,
  } from "@/core/index.js";
  
  import {
    getDefaultFormState,
    getUiOptions,
    retrieveSchema,
    getFormContext,
  } from "../../context/index.js";
  import { getComponent } from '../../component.js';
  import { getTemplate } from '../../templates/index.js';
  
  import { getField, type FieldProps } from '../model.js';

  import { getArrayItemSchemaId, getArrayContext } from './context.js';
  import { getArrayItemName, getNormalArrayItemTitle } from './get-array-item-name.js'

  let { value = $bindable(), config }: FieldProps<"normalArray"> = $props()

  const ctx = getFormContext();
  const arrayCtx = getArrayContext();

  const ArrayItem = $derived(getField(ctx, "arrayItem", config));
  const Template = $derived(getTemplate(ctx, "array", config));
  const Button = $derived(getComponent(ctx, "button", config));

  const schemaItems: Schema = $derived(
    isSchemaObjectValue(config.schema.items) ? config.schema.items : {}
  );
  const itemUiSchema = $derived(
    config.uiSchema.items !== undefined &&
      !Array.isArray(config.uiSchema.items)
      ? config.uiSchema.items
      : {}
  );
</script>

{#snippet addButton()}
  <Button
    errors={arrayCtx.errors}
    config={config}
    attributes={config.uiOptions?.button}
    type="array-item-add"
    disabled={arrayCtx.disabled}
    onclick={(e) => {
      e.preventDefault();
      value?.push(getDefaultFormState(ctx, schemaItems, undefined))
    }}
  >
    {@render ctx.iconOrTranslation(["add-array-item"])}
  </Button>
{/snippet}
<Template
  errors={arrayCtx.errors}
  config={config}
  value={value}
  addButton={arrayCtx.canAdd ? addButton : undefined}
>
  {#if value}
    {#each value as item, index}
      {@const itemSchema = retrieveSchema(ctx, schemaItems, item)}
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
          title: getNormalArrayItemTitle(config, index),
          schema: itemSchema,
          uiSchema: itemUiSchema,
          uiOptions: getUiOptions(ctx, itemUiSchema),
          idSchema: itemIdSchema,
          required: !isSchemaNullable(itemSchema),
        }}
        bind:arr={value}
        bind:value={value[index]}
        canCopy={arrayCtx.copyable && arrayCtx.canAdd}
        canRemove={arrayCtx.removable}
        canMoveUp={arrayCtx.orderable && index > 0}
        canMoveDown={arrayCtx.orderable && index < value.length - 1}
      />
    {/each}
  {/if}
</Template>

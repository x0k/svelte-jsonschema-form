<script lang="ts">
  import { getFormContext } from "../../context";
  import {
    isSchemaNullable,
    isSchemaObjectValue,
    type Schema,
    type SchemaArrayValue,
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
  import { getArrayItemName, getArrayItemTitle } from './get-array-item-name'
  import { getArrayItemSchemaId } from './get-array-item-schema-id'

  let { value = $bindable() }: { value: SchemaArrayValue | undefined } = $props()

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
    errors={arrayCtx.errors}
    config={arrayCtx.config}
    attributes={arrayCtx.config.uiOptions?.button}
    type="array-item-add"
    disabled={arrayCtx.disabledOrReadonly}
    onclick={makeHandler(() => {
      value?.push(getDefaultFormState(ctx, schemaItems, undefined))
    })}
  />
{/snippet}
<Template
  errors={arrayCtx.errors}
  config={arrayCtx.config}
  value={value}
  addButton={arrayCtx.canAdd ? addButton : undefined}
>
  {#if value}
    {#each value as item, index}
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
          title: getArrayItemTitle(arrayCtx, index),
          schema: itemSchema,
          uiSchema: itemUiSchema,
          uiOptions: getUiOptions(ctx, itemUiSchema),
          idSchema: itemIdSchema,
          required: !isSchemaNullable(itemSchema),
        }}
        bind:arr={value}
        bind:value={value[index]}
        canRemove={true}
        canMoveUp={index > 0}
        canMoveDown={index < value.length - 1}
      />
    {/each}
  {/if}
</Template>

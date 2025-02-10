<script lang="ts">
  import {
    isSchemaNullable,
    isSchemaObjectValue,
    type Schema,
  } from "@/core/index.js";
  import {
    getComponent,
    getUiOptions,
    retrieveSchema,
    getFormContext,
    makeArrayItemId,
    makeIdSchema,
  } from "@/form/index.js";

  import type { FieldProps } from "../fields.js";

  import { getArrayContext } from "./context.js";
  import {
    getArrayItemName,
    getNormalArrayItemTitle,
  } from "./get-array-item-name.js";

  let { value = $bindable(), config }: FieldProps<"normalArray"> = $props();

  const ctx = getFormContext();
  const arrayCtx = getArrayContext();

  const ArrayItem = $derived(getComponent(ctx, "arrayItemField", config));
  const Template = $derived(getComponent(ctx, "arrayTemplate", config));
  const Button = $derived(getComponent(ctx, "button", config));

  const schemaItems: Schema = $derived(
    isSchemaObjectValue(config.schema.items) ? config.schema.items : {}
  );
  const itemUiSchema = $derived(
    config.uiSchema.items !== undefined && !Array.isArray(config.uiSchema.items)
      ? config.uiSchema.items
      : {}
  );
</script>

{#snippet addButton()}
  <Button
    errors={arrayCtx.errors}
    {config}
    type="array-item-add"
    onclick={() => {
      arrayCtx.pushItem(schemaItems);
    }}
  >
    <ctx.IconOrTranslation data={["add-array-item"]} />
  </Button>
{/snippet}
<Template
  errors={arrayCtx.errors}
  {config}
  {value}
  addButton={arrayCtx.canAdd ? addButton : undefined}
>
  {#if value}
    {#each value as item, index (arrayCtx.key(index))}
      {@const itemSchema = retrieveSchema(ctx, schemaItems, item)}
      {@const itemIdSchema = makeIdSchema(
        ctx,
        itemSchema,
        makeArrayItemId(ctx, config.idSchema.$id, index),
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
        bind:value={value[index]}
        canCopy={arrayCtx.copyable && arrayCtx.canAdd}
        canRemove={arrayCtx.removable}
        canMoveUp={arrayCtx.orderable && index > 0}
        canMoveDown={arrayCtx.orderable && index < value.length - 1}
      />
    {/each}
  {/if}
</Template>

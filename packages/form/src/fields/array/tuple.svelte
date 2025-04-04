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
    createChildId,
    type ComponentProps,
    Text,
  } from "@/form/index.js";

  import { createArrayContext, setArrayContext } from "./context.svelte.js";
  import {
    getArrayItemName,
    getFixedArrayItemTitle,
  } from "./get-array-item-name.js";

  let { value = $bindable(), config }: ComponentProps["tupleField"] = $props();

  const ctx = getFormContext();
  const arrayCtx = createArrayContext(
    ctx,
    () => config,
    () => value
  );
  setArrayContext(arrayCtx);

  $effect(() => {
    if (value === undefined) {
      value = new Array(schemaItems.length);
      return;
    }
    if (value.length < schemaItems.length) {
      value.push(...new Array(schemaItems.length - value.length));
    }
  });

  const ArrayItem = $derived(getComponent(ctx, "arrayItemField", config));
  const Template = $derived(getComponent(ctx, "arrayTemplate", config));
  const Button = $derived(getComponent(ctx, "button", config));

  const schemaItems = $derived(
    Array.isArray(config.schema.items)
      ? config.schema.items.map((item, i) => {
          if (typeof item === "boolean") {
            throw new Error(
              "Invalid schema: items must be an array of schemas"
            );
          }
          return retrieveSchema(ctx, item, value?.[i]);
        })
      : []
  );
  const schemaAdditionalItems: Schema | false = $derived(
    isSchemaObjectValue(config.schema?.additionalItems)
      ? config.schema.additionalItems
      : false
  );
</script>

{#snippet addButton()}
  <Button
    errors={arrayCtx.errors}
    {config}
    type="array-item-add"
    disabled={false}
    onclick={() => {
      if (schemaAdditionalItems === false) {
        return;
      }
      arrayCtx.pushItem(schemaAdditionalItems);
    }}
  >
    <Text {config} id="add-array-item" />
  </Button>
{/snippet}
<Template
  type="template"
  {value}
  {config}
  errors={arrayCtx.errors}
  addButton={arrayCtx.canAdd && schemaAdditionalItems ? addButton : undefined}
>
  {#if value}
    {#each value as item, index (arrayCtx.key(index))}
      {@const isAdditional = index >= schemaItems.length}
      {@const itemSchema =
        isAdditional && schemaAdditionalItems
          ? retrieveSchema(ctx, schemaAdditionalItems, item)
          : schemaItems[index]!}
      {@const uiSchema = config.uiSchema}
      {@const itemUiSchema =
        (isAdditional
          ? uiSchema.additionalItems
          : Array.isArray(uiSchema.items)
            ? uiSchema.items[index]
            : uiSchema.items) ?? {}}
      <ArrayItem
        type="field"
        {index}
        config={{
          id: createChildId(config.id, index, ctx),
          name: getArrayItemName(config, index),
          title: getFixedArrayItemTitle(config, index),
          schema: itemSchema,
          uiSchema: itemUiSchema,
          uiOptions: getUiOptions(ctx, itemUiSchema),
          required: !isSchemaNullable(itemSchema),
        }}
        bind:value={value[index]}
        canCopy={arrayCtx.copyable && isAdditional && arrayCtx.canAdd}
        canRemove={arrayCtx.removable && isAdditional}
        canMoveUp={arrayCtx.orderable && index > schemaItems.length}
        canMoveDown={arrayCtx.orderable &&
          isAdditional &&
          index < value.length - 1}
      />
    {/each}
  {/if}
</Template>

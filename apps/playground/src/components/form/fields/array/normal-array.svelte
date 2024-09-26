<script lang="ts">
  import { getFormContext } from "../../context";
  import {
    isSchemaNullable,
    isSchemaObjectValue,
    type Schema,
  } from "../../schema";
  import type { UiSchema } from "../../ui-schema";
  import {
    getArrayItemSchemaId,
    getComponent,
    getDefaultFormState,
    getTemplate,
    retrieveSchema,
  } from "../../utils";

  import { getArrayContext } from "./context";
  import ArrayItem from "./array-item.svelte";

  const ctx = getFormContext();
  const arrayCtx = getArrayContext();

  const Template = $derived(getTemplate(ctx, "array", arrayCtx.uiSchema));
  const Title = $derived(getComponent(ctx, "title", arrayCtx.uiSchema));
  const Description = $derived(getComponent(ctx, "description", arrayCtx.uiSchema));
  const Button = $derived(getComponent(ctx, "button", arrayCtx.uiSchema));

  const schemaItems: Schema = $derived(
    // NOTE: Fixed array is covered in another component
    isSchemaObjectValue(arrayCtx.schema.items) ? arrayCtx.schema.items : {}
  );
  const itemUiSchema: UiSchema = $derived(
    arrayCtx.uiSchema.items !== undefined &&
      !Array.isArray(arrayCtx.uiSchema.items)
      ? arrayCtx.uiSchema.items
      : {}
  );
</script>

{#snippet description()}
  <Description type="array" description={arrayCtx.description!} />
{/snippet}
{#snippet addButton()}
  <Button type="add-array-item" disabled={arrayCtx.disabled || arrayCtx.readonly} onclick={(e) => {
    e.preventDefault()
    if (!Array.isArray(arrayCtx.value)) {
      console.warn("Value is not an array")
      return
    }
    arrayCtx.value.push(getDefaultFormState(ctx, schemaItems))
  }} />
{/snippet}
<Template
  name={arrayCtx.name}
  value={arrayCtx.value}
  schema={arrayCtx.schema}
  uiSchema={arrayCtx.uiSchema}
  idSchema={arrayCtx.idSchema}
  required={arrayCtx.required}
  description={arrayCtx.description !== undefined ? description : undefined}
  addButton={arrayCtx.canAdd ? addButton : undefined}
>
  {#snippet title()}
    <Title type="array" title={arrayCtx.label} />
  {/snippet}
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
      {@const itemRequired = !isSchemaNullable(itemSchema)}
      <ArrayItem
        {index}
        name={`${arrayCtx.name}-${index}`}
        bind:value={arrayCtx.value[index]}
        schema={itemSchema}
        uiSchema={itemUiSchema}
        idSchema={itemIdSchema}
        canRemove={true}
        canMoveUp={index > 0}
        canMoveDown={index < arrayCtx.value.length - 1}
        required={itemRequired}
      />
    {/each}
  {/if}
</Template>

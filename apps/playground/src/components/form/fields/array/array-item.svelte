<script lang="ts">
  import type { Schema, SchemaValue } from "../../schema";
  import type { UiSchema } from "../../ui-schema";
  import type { IdSchema } from "../../id-schema";
  import { getFormContext } from "../../context";
  import { getComponent, getComponentProps, getField, getTemplate } from "../../utils";

  import { getArrayContext } from './context';

  let {
    index,
    name,
    value = $bindable(),
    schema,
    uiSchema,
    idSchema,
    required,
    //
    canRemove,
    canMoveUp,
    canMoveDown,
  }: {
    index: number;
    name: string;
    value: SchemaValue | undefined;
    schema: Schema;
    uiSchema: UiSchema;
    idSchema: IdSchema<SchemaValue>;
    required: boolean;

    canRemove: boolean;
    canMoveUp: boolean;
    canMoveDown: boolean;
  } = $props();

  const ctx = getFormContext();
  const arrayCtx = getArrayContext();

  const Template = $derived(getTemplate(ctx, "array-item", uiSchema));
  const Field = $derived(getField(ctx, "root", uiSchema));
  const Button = $derived(getComponent(ctx, "button", uiSchema))

  const moveUp = $derived(arrayCtx.orderable && canMoveUp)
  const moveDown = $derived(arrayCtx.orderable && canMoveDown)
  const remove = $derived(arrayCtx.removable && canRemove)
  const copy = $derived(arrayCtx.copyable && arrayCtx.canAdd)
  const toolbar = $derived(moveUp || moveDown || remove || copy)
  const componentProps = $derived(getComponentProps(ctx, uiSchema))
</script>

{#snippet buttons()}
  {#if arrayCtx.orderable}
    <Button
      type="move-up-array-item"
      disabled={componentProps.disabled || componentProps.readonly || !moveUp}
    />
    <Button
      type="move-down-array-item"
      disabled={componentProps.disabled || componentProps.readonly || !moveDown}
    />
  {/if}
  {#if copy}
    <Button
      type="copy-array-item"
      disabled={componentProps.disabled || componentProps.readonly}
      onclick={(e) => {
        e.preventDefault()
        if (!Array.isArray(arrayCtx.value)) {
          console.warn("Value is not an array")
          return
        }
        const itemClone = $state.snapshot(value)
        arrayCtx.value.splice(index, 0, itemClone)
      }}
    />
  {/if}
  {#if remove}
    <Button
      type="remove-array-item"
      disabled={componentProps.disabled || componentProps.readonly}
      onclick={(e) => {
        e.preventDefault()
        if (!Array.isArray(arrayCtx.value)) {
          console.warn("Value is not an array")
          return
        }
        arrayCtx.value.splice(index, 1)
      }}
    />
  {/if}
{/snippet}
<Template
  {index}
  {name}
  {value}
  {schema}
  {uiSchema}
  {idSchema}
  {required}
  buttons={toolbar ? buttons : undefined}
>
  <Field {name} bind:value {schema} {uiSchema} {idSchema} {required} />
</Template>

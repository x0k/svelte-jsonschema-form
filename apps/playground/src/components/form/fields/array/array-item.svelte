<script lang="ts">
  import type { Schema, SchemaArrayValue, SchemaValue } from "../../schema";
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

  function makeHandler(fn: (arr: SchemaArrayValue) => void) {
    return (e: Event) => {
      e.preventDefault()
      const arr = arrayCtx.value
      if (!Array.isArray(arr)) {
        console.warn("Value is not an array")
        return
      }
      fn(arr)
    }
  }
</script>

{#snippet buttons()}
  {#if arrayCtx.orderable}
    <Button
      type="move-up-array-item"
      disabled={componentProps.disabled || componentProps.readonly || !moveUp}
      onclick={makeHandler((arr) => {
        const tmp = arr[index]
        arr[index] = arr[index - 1]
        arr[index - 1] = tmp
      })}
    />
    <Button
      type="move-down-array-item"
      disabled={componentProps.disabled || componentProps.readonly || !moveDown}
      onclick={makeHandler((arr) => {
        const tmp = arr[index]
        arr[index] = arr[index + 1]
        arr[index + 1] = tmp
      })}
    />
  {/if}
  {#if copy}
    <Button
      type="copy-array-item"
      disabled={componentProps.disabled || componentProps.readonly}
      onclick={makeHandler((arr) => {
        arr.splice(index, 0, $state.snapshot(value))
      })}
    />
  {/if}
  {#if remove}
    <Button
      type="remove-array-item"
      disabled={componentProps.disabled || componentProps.readonly}
      onclick={makeHandler((arr) => {
        arr.splice(index, 1)
      })}
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

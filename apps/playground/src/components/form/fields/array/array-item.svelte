<script lang="ts">
  import type { Schema, SchemaValue } from "../../schema";
  import type { UiSchema } from "../../ui-schema";
  import type { IdSchema } from "../../id-schema";
  import { getFormContext } from "../../context";
  import { getComponent, getField, getTemplate, getUiOptions } from "../../utils";

  import { isDisabledOrReadonly } from '../is-disabled-or-readonly'

  import { getArrayContext } from './context';
  import { makeHandler } from './make-click-handler';

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
  const uiOptions = $derived(getUiOptions(ctx, uiSchema))
  const disabledOrReadonly = $derived(
    isDisabledOrReadonly(ctx, uiOptions?.input)
  )
</script>

{#snippet buttons()}
  {#if arrayCtx.orderable}
    <Button
      type="array-item-move-up"
      disabled={disabledOrReadonly || !moveUp}
      onclick={makeHandler(arrayCtx, (arr) => {
        const tmp = arr[index]
        arr[index] = arr[index - 1]
        arr[index - 1] = tmp
      })}
    />
    <Button
      type="array-item-move-down"
      disabled={disabledOrReadonly || !moveDown}
      onclick={makeHandler(arrayCtx, (arr) => {
        const tmp = arr[index]
        arr[index] = arr[index + 1]
        arr[index + 1] = tmp
      })}
    />
  {/if}
  {#if copy}
    <Button
      type="array-item-copy"
      disabled={disabledOrReadonly}
      onclick={makeHandler(arrayCtx, (arr) => {
        arr.splice(index, 0, $state.snapshot(value))
      })}
    />
  {/if}
  {#if remove}
    <Button
      type="array-item-remove"
      disabled={disabledOrReadonly}
      onclick={makeHandler(arrayCtx, (arr) => {
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
  {uiOptions}
  buttons={toolbar ? buttons : undefined}
>
  <Field {name} bind:value {schema} {uiSchema} {idSchema} {required} />
</Template>

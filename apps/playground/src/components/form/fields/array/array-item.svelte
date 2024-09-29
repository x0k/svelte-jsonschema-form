<script lang="ts">
  import type { SchemaValue } from "../../schema";
  import type { Config } from '../../config';
  import { getFormContext } from "../../context";
  import { getComponent } from '../../component';
  import { getTemplate } from '../../templates';
  import { getUiOptions } from "../../utils";

  import { getField } from '../model';
  import { isDisabledOrReadonly } from '../is-disabled-or-readonly'

  import { getArrayContext } from './context';
  import { makeHandler } from './make-click-handler';

  let {
    index,
    value = $bindable(),
    config,
    //
    canRemove,
    canMoveUp,
    canMoveDown,
  }: {
    index: number;
    value: SchemaValue | undefined;
    config: Config<SchemaValue>;

    canRemove: boolean;
    canMoveUp: boolean;
    canMoveDown: boolean;
  } = $props();

  const ctx = getFormContext();
  const arrayCtx = getArrayContext();

  const Template = $derived(getTemplate(ctx, "array-item", config));
  const Field = $derived(getField(ctx, "root", config));
  const Button = $derived(getComponent(ctx, "button", config));

  const moveUp = $derived(arrayCtx.orderable && canMoveUp)
  const moveDown = $derived(arrayCtx.orderable && canMoveDown)
  const remove = $derived(arrayCtx.removable && canRemove)
  const copy = $derived(arrayCtx.copyable && arrayCtx.canAdd)
  const toolbar = $derived(moveUp || moveDown || remove || copy)
  const uiOptions = $derived(getUiOptions(ctx, config.uiSchema))
  const disabledOrReadonly = $derived(
    isDisabledOrReadonly(ctx, uiOptions?.input)
  )
</script>

{#snippet buttons()}
  {#if arrayCtx.orderable}
    <Button
      {config}
      type="array-item-move-up"
      disabled={disabledOrReadonly || !moveUp}
      onclick={makeHandler(arrayCtx, (arr) => {
        const tmp = arr[index]
        arr[index] = arr[index - 1]
        arr[index - 1] = tmp
      })}
    />
    <Button
      {config}
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
      {config}
      type="array-item-copy"
      disabled={disabledOrReadonly}
      onclick={makeHandler(arrayCtx, (arr) => {
        arr.splice(index, 0, $state.snapshot(value))
      })}
    />
  {/if}
  {#if remove}
    <Button
      {config}
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
  {value}
  {config}
  buttons={toolbar ? buttons : undefined}
>
  <Field bind:value {config} />
</Template>

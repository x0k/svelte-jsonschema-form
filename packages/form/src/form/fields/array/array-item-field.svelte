<script lang="ts">
  import { getFormContext } from "../../context.js";
  import { getComponent } from '../../component.js';
  import { getTemplate } from '../../templates/index.js';
  import { getErrors, getUiOptions } from "../../utils.js";

  import { getField, type FieldProps } from '../model.js';
  import { isDisabled } from '../../is-disabled.js'

  import { getArrayContext } from './context.js';
  import { makeHandler } from './make-click-handler.js';

  let {
    index,
    arr = $bindable(),
    value = $bindable(),
    config,
    //
    canRemove,
    canMoveUp,
    canMoveDown,
  }: FieldProps<"arrayItem"> = $props();

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
  const disabled = $derived(
    isDisabled(ctx, uiOptions?.input)
  )
  const errors = $derived(getErrors(ctx, config.idSchema))
</script>

{#snippet buttons()}
  {#if arrayCtx.orderable}
    <Button
      {errors}
      {config}
      type="array-item-move-up"
      disabled={disabled || !moveUp}
      onclick={makeHandler(() => {
        const tmp = arr[index]
        arr[index] = arr[index - 1]
        arr[index - 1] = tmp
      })}
    >
      {@render ctx.iconOrTranslation(["move-array-item-up"])}
    </Button>
    <Button
      {errors}
      {config}
      type="array-item-move-down"
      disabled={disabled || !moveDown}
      onclick={makeHandler(() => {
        const tmp = arr[index]
        arr[index] = arr[index + 1]
        arr[index + 1] = tmp
      })}
    >
      {@render ctx.iconOrTranslation(["move-array-item-down"])}
    </Button>
  {/if}
  {#if copy}
    <Button
      {errors}
      {config}
      {disabled}
      type="array-item-copy"
      onclick={makeHandler(() => {
        arr.splice(index, 0, $state.snapshot(value))
      })}
    >
      {@render ctx.iconOrTranslation(["copy-array-item"])}
    </Button>
  {/if}
  {#if remove}
    <Button
      {errors}
      {config}
      type="array-item-remove"
      {disabled}
      onclick={makeHandler(() => {
        arr.splice(index, 1)
      })}
    >
      {@render ctx.iconOrTranslation(["remove-array-item"])}
    </Button>
  {/if}
{/snippet}
<Template
  {index}
  {value}
  {config}
  {errors}
  buttons={toolbar ? buttons : undefined}
>
  <Field bind:value {config} />
</Template>

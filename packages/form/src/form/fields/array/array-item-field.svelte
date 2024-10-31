<script lang="ts">
  import {
    getComponent,
    getTemplate,
    getField,
    isDisabled,
    getErrors,
    getUiOptions,
    getFormContext
  } from "../../context/index.js";

  import type { FieldProps } from '../model.js';

  import { getArrayContext } from './context.js';

  let {
    index,
    arr = $bindable(),
    value = $bindable(),
    config,
    canCopy,
    canRemove,
    canMoveUp,
    canMoveDown,
  }: FieldProps<"arrayItem"> = $props();

  const ctx = getFormContext();
  const arrayCtx = getArrayContext();

  const Template = $derived(getTemplate(ctx, "array-item", config));
  const Field = $derived(getField(ctx, "root", config));
  const Button = $derived(getComponent(ctx, "button", config));

  const toolbar = $derived(canCopy || canRemove || canMoveUp || canMoveDown);
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
      disabled={disabled || !canMoveUp}
      onclick={(e) => {
        e.preventDefault()
        const tmp = arr[index]
        arr[index] = arr[index - 1]
        arr[index - 1] = tmp
      }}
    >
      <ctx.IconOrTranslation data={["move-array-item-up"]} />
    </Button>
    <Button
      {errors}
      {config}
      type="array-item-move-down"
      disabled={disabled || !canMoveDown}
      onclick={(e) => {
        e.preventDefault()
        const tmp = arr[index]
        arr[index] = arr[index + 1]
        arr[index + 1] = tmp
      }}
    >
      <ctx.IconOrTranslation data={["move-array-item-down"]} />
    </Button>
  {/if}
  {#if canCopy}
    <Button
      {errors}
      {config}
      {disabled}
      type="array-item-copy"
      onclick={(e) => {
        e.preventDefault()
        arr.splice(index, 0, $state.snapshot(value))
      }}
    >
      <ctx.IconOrTranslation data={["copy-array-item"]} />
    </Button>
  {/if}
  {#if canRemove}
    <Button
      {errors}
      {config}
      type="array-item-remove"
      {disabled}
      onclick={(e) => {
        e.preventDefault()
        arr.splice(index, 1)
      }}
    >
      <ctx.IconOrTranslation data={["remove-array-item"]} />
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

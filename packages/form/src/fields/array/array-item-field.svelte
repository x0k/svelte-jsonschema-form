<script lang="ts">
  import {
    getComponent,
    getTemplate,
    getField,
    getErrors,
    getFormContext,
    type FieldProps,
  } from "@/form/index.js";

  import { getArrayContext } from "./context.js";

  let {
    index,
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
  const errors = $derived(getErrors(ctx, config.idSchema));
</script>

{#snippet buttons()}
  {#if arrayCtx.orderable}
    <Button
      {errors}
      {config}
      type="array-item-move-up"
      onclick={() => {
        arrayCtx.moveItemUp(index);
      }}
    >
      <ctx.IconOrTranslation data={["move-array-item-up"]} />
    </Button>
    <Button
      {errors}
      {config}
      type="array-item-move-down"
      onclick={() => {
        arrayCtx.moveItemDown(index);
      }}
    >
      <ctx.IconOrTranslation data={["move-array-item-down"]} />
    </Button>
  {/if}
  {#if canCopy}
    <Button
      {errors}
      {config}
      type="array-item-copy"
      onclick={() => {
        arrayCtx.copyItem(index);
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
      onclick={() => {
        arrayCtx.removeItem(index);
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

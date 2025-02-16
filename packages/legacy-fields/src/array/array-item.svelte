<script lang="ts">
  import {
    getComponent,
    getErrors,
    getFormContext,
    type ComponentProps,
  } from "@sjsf/form";

  import { getArrayContext } from "./context.js";

  let {
    index,
    value = $bindable(),
    config,
    canCopy,
    canRemove,
    canMoveUp,
    canMoveDown,
  }: ComponentProps["arrayItemField"] = $props();

  const ctx = getFormContext();
  const arrayCtx = getArrayContext();

  const Template = $derived(getComponent(ctx, "arrayItemTemplate", config));
  const Field = $derived(getComponent(ctx, "rootField", config));
  const Button = $derived(getComponent(ctx, "button", config));

  const toolbar = $derived(canCopy || canRemove || canMoveUp || canMoveDown);
  const errors = $derived(getErrors(ctx, config.id));
</script>

{#snippet buttons()}
  {#if arrayCtx.orderable}
    <Button
      {errors}
      {config}
      type="array-item-move-up"
      disabled={!canMoveUp}
      onclick={() => {
        arrayCtx.moveItemUp(index);
      }}
    >
      <ctx.IconOrTranslation data={["move-array-item-up"]} />
    </Button>
    <Button
      {errors}
      {config}
      disabled={!canMoveDown}
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
      disabled={false}
    >
      <ctx.IconOrTranslation data={["copy-array-item"]} />
    </Button>
  {/if}
  {#if canRemove}
    <Button
      {errors}
      {config}
      disabled={false}
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

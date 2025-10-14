<script lang="ts" module>
  import "@/form/extra-fields/array-item.js";
  import "../extra-templates/array-item.js";

  declare module "../components.js" {
    interface ButtonTypes {
      "array-item-add": {};
      "array-item-move-down": {};
      "array-item-move-up": {};
      "array-item-copy": {};
      "array-item-remove": {};
    }
  }
</script>

<script lang="ts">
  import {
    getComponent,
    getFieldErrors,
    getFieldComponent,
    getFormContext,
    Text,
    type ComponentProps,
  } from "@/form/index.js";

  import { getArrayContext } from "./context.svelte.js";

  let {
    index,
    value = $bindable(),
    config,
    uiOption,
    translate,
  }: ComponentProps["arrayItemField"] = $props();

  const ctx = getFormContext();
  const arrayCtx = getArrayContext();

  const Template = $derived(getComponent(ctx, "arrayItemTemplate", config));
  const Field = $derived(getFieldComponent(ctx, config));
  const Button = $derived(getComponent(ctx, "button", config));

  const canCopy = $derived(arrayCtx.canCopy(index));
  const canRemove = $derived(arrayCtx.canRemove(index));
  const canMoveUp = $derived(arrayCtx.canMoveUp(index));
  const canMoveDown = $derived(arrayCtx.canMoveDown(index));
  const toolbar = $derived(canCopy || canRemove || canMoveUp || canMoveDown);
  const errors = $derived(getFieldErrors(ctx, config.path));
</script>

{#snippet buttons()}
  {#if arrayCtx.orderable()}
    <Button
      {errors}
      {config}
      type="array-item-move-up"
      disabled={!canMoveUp}
      onclick={() => {
        arrayCtx.moveItemUp(index);
      }}
    >
      <Text {config} id="move-array-item-up" {translate} />
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
      <Text {config} id="move-array-item-down" {translate} />
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
      <Text {config} id="copy-array-item" {translate} />
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
      <Text {config} id="remove-array-item" {translate} />
    </Button>
  {/if}
{/snippet}
<Template
  type="template"
  {index}
  {value}
  {config}
  {errors}
  buttons={toolbar ? buttons : undefined}
  {uiOption}
>
  <Field
    type="field"
    bind:value={value as undefined}
    {config}
    {uiOption}
    {translate}
  />
</Template>

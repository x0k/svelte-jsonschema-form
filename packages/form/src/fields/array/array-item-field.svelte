<script lang="ts" module>
  declare module "../../form/index.js" {
    interface FoundationalComponents {
      arrayItemField: {};
    }
    interface ComponentProps {
      arrayItemField: FieldCommonProps<SchemaValue> & {
        index: number;
      };
    }
    interface ComponentBindings {
      arrayItemField: "value";
    }
  }
</script>

<script lang="ts">
  import {
    getComponent,
    getErrors,
    getFieldComponent,
    getFormContext,
    Text,
    type ComponentProps,
    type FieldCommonProps,
    type SchemaValue,
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
  const errors = $derived(getErrors(ctx, config.id));
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

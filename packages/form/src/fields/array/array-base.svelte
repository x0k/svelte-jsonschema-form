<script lang="ts">
  import { isSchemaArrayValue } from "@/core/value.js";
  import {
    getComponent,
    getFormContext,
    type ComponentProps,
    Text,
  } from "@/form/index.js";

  import { createArrayContext, setArrayContext } from "./context.svelte.js";

  let {
    value = $bindable(),
    config,
    isTuple,
  }: ComponentProps["arrayField" | "tupleField"] & {
    isTuple: boolean;
  } = $props();

  const ctx = getFormContext();
  const arrayCtx = createArrayContext(
    ctx,
    isTuple,
    () => config,
    () => value,
    (v) => (value = v)
  );
  setArrayContext(arrayCtx);

  const ArrayItem = $derived(getComponent(ctx, "arrayItemField", config));
  const Template = $derived(getComponent(ctx, "arrayTemplate", config));
  const Button = $derived(getComponent(ctx, "button", config));
</script>

{#snippet addButton()}
  <Button
    errors={arrayCtx.errors}
    {config}
    disabled={false}
    type="array-item-add"
    onclick={arrayCtx.pushItem}
  >
    <Text {config} id="add-array-item" />
  </Button>
{/snippet}
<Template
  type="template"
  errors={arrayCtx.errors}
  {config}
  {value}
  addButton={arrayCtx.addable ? addButton : undefined}
>
  {#if isSchemaArrayValue(value)}
    {#each value as item, index (arrayCtx.key(index))}
      <ArrayItem
        type="field"
        {index}
        config={arrayCtx.itemConfig(config, item, index)}
        bind:value={value[index]}
        canCopy={arrayCtx.canCopy(index)}
        canRemove={arrayCtx.canRemove(index)}
        canMoveUp={arrayCtx.canMoveUp(index)}
        canMoveDown={arrayCtx.canMoveDown(value.length, index)}
      />
    {/each}
  {/if}
</Template>

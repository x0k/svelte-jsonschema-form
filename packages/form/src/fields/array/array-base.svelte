<script lang="ts">
  import { isSchemaArrayValue, type SchemaArrayValue } from "@/core/index.js";
  import {
    getComponent,
    getFormContext,
    type ComponentProps,
    Text,
    type FormInternalContext,
    type Validator,
    type Config,
  } from "@/form/index.js";

  import { setArrayContext, type ArrayContext } from "./context.svelte.js";

  let {
    value = $bindable(),
    config,
    createArrayContext,
  }: ComponentProps["arrayField" | "tupleField"] & {
    createArrayContext: <V extends Validator>(
      ctx: FormInternalContext<V>,
      config: () => Config,
      value: () => SchemaArrayValue | undefined,
      setValue: (v: SchemaArrayValue) => void
    ) => ArrayContext<V>;
  } = $props();

  const ctx = getFormContext();
  const arrayCtx = createArrayContext(
    ctx,
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
  addButton={arrayCtx.canAdd() ? addButton : undefined}
>
  {#if isSchemaArrayValue(value)}
    {#each value as item, index (arrayCtx.key(index))}
      <ArrayItem
        type="field"
        {index}
        config={arrayCtx.itemConfig(config, item, index)}
        bind:value={value[index]}
      />
    {/each}
  {/if}
</Template>

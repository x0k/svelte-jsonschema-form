<script lang="ts">
  import { flip } from "svelte/animate";
  import { fade } from "svelte/transition";

  import { isSchemaArrayValue } from "@sjsf/form/core";
  import {
    getComponent,
    getFormContext,
    type ComponentProps,
    Text,
    retrieveUiOption,
  } from "@sjsf/form";
  import {
    createArrayContext,
    setArrayContext,
  } from "@sjsf/form/fields/array/context.svelte";

  let {
    value = $bindable(),
    config,
    uiOption,
  }: ComponentProps["arrayField"] = $props();

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
  {uiOption}
  addButton={arrayCtx.canAdd() ? addButton : undefined}
>
  {#if isSchemaArrayValue(value)}
    {#each value as item, index (arrayCtx.key(index))}
      {@const cfg = arrayCtx.itemConfig(config, item, index)}
      <div animate:flip transition:fade>
        <ArrayItem
          type="field"
          {index}
          bind:value={value[index]}
          config={cfg}
          uiOption={(opt) => retrieveUiOption(ctx, cfg, opt)}
        />
      </div>
    {/each}
  {/if}
</Template>

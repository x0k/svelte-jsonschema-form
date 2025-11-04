<script lang="ts">
  import { flip } from "svelte/animate";
  import { fade } from "svelte/transition";

  import { SimpleKeyedArray } from "@sjsf/form/lib/keyed-array.svelte";
  import {
    getComponent,
    getFormContext,
    type ComponentProps,
    Text,
    retrieveUiOption,
    retrieveTranslate,
    createKeyedArrayDeriver,
  } from "@sjsf/form";
  import { VirtualKeyedArray } from "@sjsf/form/fields/array/virtual-keyed-array";
  import {
    createArrayContext,
    setArrayContext,
  } from "@sjsf/form/fields/array/context.svelte";

  let {
    value = $bindable(),
    config,
    uiOption,
    translate,
  }: ComponentProps["arrayField"] = $props();

  const ctx = getFormContext();
  const arrayCtx = createArrayContext({
    ctx,
    config: () => config,
    value: () => value,
    keyedArray: createKeyedArrayDeriver(
      ctx,
      () => value,
      () => new VirtualKeyedArray((v) => (value = v)),
      (v, g) => new SimpleKeyedArray(v, g)
    ),
  });
  setArrayContext(arrayCtx);

  const ArrayItem = $derived(getComponent(ctx, "arrayItemField", config));
  const Template = $derived(getComponent(ctx, "arrayTemplate", config));
  const Button = $derived(getComponent(ctx, "button", config));
</script>

{#snippet addButton()}
  <Button
    errors={arrayCtx.errors()}
    {config}
    disabled={false}
    type="array-item-add"
    onclick={arrayCtx.pushItem}
  >
    <Text {config} id="add-array-item" {translate} />
  </Button>
{/snippet}
<Template
  type="template"
  errors={arrayCtx.errors()}
  {config}
  {value}
  {uiOption}
  addButton={arrayCtx.canAdd() ? addButton : undefined}
>
  {#each { length: arrayCtx.length() } as _, index (arrayCtx.key(index))}
    {@const cfg = arrayCtx.itemConfig(config, value?.[index], index)}
    <div animate:flip transition:fade>
      <ArrayItem
        type="field"
        {index}
        config={cfg}
        bind:value={() => value?.[index], (v) => arrayCtx.set(index, v)}
        uiOption={(opt) => retrieveUiOption(ctx, cfg, opt)}
        translate={retrieveTranslate(ctx, cfg)}
      />
    </div>
  {/each}
</Template>

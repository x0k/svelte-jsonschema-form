<script lang="ts" module>
  import "@/form/extra-fields/array-item.js";
  import "../extra-templates/array.js";

  declare module "../components.js" {
    interface ButtonTypes {
      "array-item-add": {};
    }
  }
</script>

<script lang="ts">
  import { SimpleKeyedArray } from "@/lib/keyed-array.svelte.js";
  import {
    getComponent,
    getFormContext,
    type ComponentProps,
    Text,
    retrieveUiOption,
    retrieveTranslate,
    createKeyedArrayDeriver,
    getFieldAction,
  } from "@/form/index.js";

  import {
    setArrayContext,
    type ArrayContext,
    type ArrayContextOptions,
  } from "./context.svelte.js";
  import { VirtualKeyedArray } from "./virtual-keyed-array.js";

  let {
    value = $bindable(),
    config,
    createArrayContext,
    uiOption,
    translate,
  }: ComponentProps["arrayField" | "tupleField"] & {
    createArrayContext: <T>(options: ArrayContextOptions<T>) => ArrayContext;
  } = $props();

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

  const action = $derived(getFieldAction(ctx, config));
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
{#snippet actionSnippet()}
  {@render action?.(ctx, config, {
    get current() {
      return value;
    },
    set current(v) {
      value = v;
    },
  })}
{/snippet}
<Template
  type="template"
  errors={arrayCtx.errors()}
  {config}
  {value}
  {uiOption}
  addButton={arrayCtx.canAdd() ? addButton : undefined}
  action={action && actionSnippet}
>
  {#each { length: arrayCtx.length() } as _, index (arrayCtx.key(index))}
    {@const cfg = arrayCtx.itemConfig(config, value?.[index], index)}
    <ArrayItem
      type="field"
      {index}
      config={cfg}
      bind:value={() => value?.[index], (v) => arrayCtx.set(index, v)}
      uiOption={(opt) => retrieveUiOption(ctx, cfg, opt)}
      translate={retrieveTranslate(ctx, cfg)}
    />
  {/each}
</Template>

const n=`<script lang="ts">
  import { flip } from "svelte/animate";
  import { fade } from "svelte/transition";

  import { isSchemaArrayValue } from "@sjsf/form/core";
  import {
    getComponent,
    getFormContext,
    type ComponentProps,
    Text,
    retrieveUiOption,
    retrieveTranslate,
  } from "@sjsf/form";
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
<\/script>

{#snippet addButton()}
  <Button
    errors={arrayCtx.errors}
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
          translate={retrieveTranslate(ctx, config)}
        />
      </div>
    {/each}
  {/if}
</Template>
`,e=`<script lang="ts">
  import { overrideByRecord } from "@sjsf/form/lib/resolver";
  import { createForm, BasicForm, type Schema } from "@sjsf/form";

  import * as defaults from "$lib/form-defaults";

  import AnimatedArray from "./animated-array.svelte";

  const schema = {
    type: "array",
    title: "Array",
    minItems: 4,
    default: ["carp", "trout", "bream"],
    items: {
      type: "string",
      default: "default",
    },
  } as const satisfies Schema;

  const theme = overrideByRecord(defaults.theme, {
    arrayField: AnimatedArray,
  });

  const form = createForm({
    ...defaults,
    theme,
    schema,
    onSubmit: console.log,
  });
<\/script>

<BasicForm {form} />
`,t={files:{"src/routes/animated-array.svelte":n,"src/routes/+page.svelte":e}};export{t as layer};

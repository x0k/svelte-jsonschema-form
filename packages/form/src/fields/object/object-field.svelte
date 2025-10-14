<script lang="ts" module>
  import "@/form/extra-fields/object-property.js";
  import "../extra-templates/object.js";

  declare module "../components.js" {
    interface ButtonTypes {
      "object-property-add": {};
    }
  }
</script>

<script lang="ts">
  import {
    Text,
    getComponent,
    getFormContext,
    retrieveTranslate,
    retrieveUiOption,
    type ComponentProps,
  } from "@/form/index.js";

  import { createObjectContext, setObjectContext } from "./context.svelte.js";

  const ctx = getFormContext();

  let {
    config,
    value = $bindable(),
    uiOption,
    translate,
  }: ComponentProps["objectField"] = $props();

  const objCtx = createObjectContext({
    ctx,
    config: () => config,
    value: () => value,
    setValue: (v) => (value = v),
    translate,
  });
  setObjectContext(objCtx);

  const ObjectProperty = $derived(
    getComponent(ctx, "objectPropertyField", config)
  );
  const Template = $derived(getComponent(ctx, "objectTemplate", config));
  const Button = $derived(getComponent(ctx, "button", config));
</script>

{#snippet addButton()}
  <Button
    type="object-property-add"
    {config}
    errors={objCtx.errors()}
    disabled={false}
    onclick={objCtx.addProperty}
  >
    <Text {config} id="add-object-property" {translate} />
  </Button>
{/snippet}
<Template
  type="template"
  {value}
  {config}
  errors={objCtx.errors()}
  addButton={objCtx.canExpand() ? addButton : undefined}
  {uiOption}
>
  {#each objCtx.propertiesOrder() as property (property)}
    {@const isAdditional = objCtx.isAdditionalProperty(property)}
    {@const cfg = objCtx.propertyConfig(config, property, isAdditional)}
    <ObjectProperty
      type="field"
      {property}
      {isAdditional}
      bind:value={
        () => value?.[property],
        (v) => {
          const c = value;
          if (!c) {
            value = { [property]: v };
          } else {
            c[property] = v;
          }
        }
      }
      config={cfg}
      uiOption={(opt) => retrieveUiOption(ctx, cfg, opt)}
      translate={retrieveTranslate(ctx, cfg)}
    />
  {/each}
</Template>

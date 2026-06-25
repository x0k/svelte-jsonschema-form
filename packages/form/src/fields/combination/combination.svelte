<script lang="ts" module>
  import type { UiSchemaDefinition } from "@/form/index.js";

  import "../extra-templates/multi-field.js";

  declare module "../../form/index.js" {
    interface UiSchemaContent {
      combinationFieldOptionSelector?: UiSchemaDefinition;
    }
  }
</script>

<script lang="ts">
  import {
    getFormContext,
    getComponent,
    type ComponentProps,
    getFieldComponent,
    retrieveUiOption,
    retrieveTranslate,
    getFieldAction,
    getFieldErrors,
  } from "@/form/index.js";

  import {
    createCombinationContext,
    setCombinationContext,
    type CombinationKey,
  } from "./context.svelte.js";

  let {
    value = $bindable(),
    config,
    combinationKey,
    uiOption,
    translate,
  }: ComponentProps["anyOfField" | "oneOfField"] & {
    combinationKey: CombinationKey;
  } = $props();

  const ctx = getFormContext();

  const combinationCtx = createCombinationContext({
    ctx,
    config: () => config,
    value: () => value,
    setValue: (v) => (value = v),
    get combinationKey() {
      return combinationKey;
    },
    get translate() {
      return translate;
    },
  });
  setCombinationContext(combinationCtx);

  const Template = $derived(getComponent(ctx, "multiFieldTemplate", config));
  const Widget = $derived(getComponent(ctx, "selectWidget", config));

  const restFieldConfig = $derived(combinationCtx.restConfig());
  const RestSchemaField = $derived(
    restFieldConfig && getFieldComponent(ctx, restFieldConfig)
  );

  const combinationFieldConfig = $derived(combinationCtx.fieldConfig());
  const CombinationField = $derived(
    combinationFieldConfig && getFieldComponent(ctx, combinationFieldConfig)
  );

  const action = $derived(
    getFieldAction(ctx, config, `${combinationKey}Field`)
  );
  const errors = $derived(getFieldErrors(ctx, config.path));
</script>

{#snippet renderAction()}
  {@render action?.(
    ctx,
    config,
    {
      get current() {
        return value;
      },
      set current(v) {
        value = v;
      },
    },
    errors
  )}
{/snippet}
{#if restFieldConfig}
  <RestSchemaField
    type="field"
    bind:value={value as undefined}
    config={restFieldConfig}
    uiOption={(opt) => retrieveUiOption(ctx, restFieldConfig, opt)}
    translate={retrieveTranslate(ctx, restFieldConfig)}
  />
{/if}
<Template
  type="template"
  {config}
  {value}
  {errors}
  {uiOption}
  action={action && renderAction}
>
  {#snippet optionSelector()}
    {@const props = combinationCtx.optionSelectorProps()}
    <Widget
      {...props}
      type="widget"
      {errors}
      handlers={{}}
      uiOption={(opt) => retrieveUiOption(ctx, props.config, opt)}
      bind:value={
        () => combinationCtx.selectedOption(), combinationCtx.selectOption
      }
    />
  {/snippet}
  {#if combinationFieldConfig}
    <CombinationField
      type="field"
      bind:value={value as undefined}
      config={combinationFieldConfig}
      uiOption={(opt) => retrieveUiOption(ctx, combinationFieldConfig, opt)}
      translate={retrieveTranslate(ctx, combinationFieldConfig)}
    />
  {/if}
</Template>

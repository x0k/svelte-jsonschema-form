<script lang="ts" module>
  import type { ActionField, Config, UiSchemaDefinition } from "#form/index.js";

  import "../extra-templates/multi-field.js";

  declare module "../../form/index.js" {
    interface UiSchemaContent {
      combinationFieldOptionSelector?: UiSchemaDefinition;
    }
  }

  type CombinationFields = keyof {
    [
      C in ActionField as Expand<ComponentProps[C]> extends Expand<
        ComponentProps["oneOfField"]
      >
        ? C
        : never
    ]: C;
  };
</script>

<script lang="ts" generics="F extends CombinationFields">
  import {
    getFormContext,
    getComponent,
    type ComponentProps,
    getFieldComponent,
    retrieveUiOption,
    retrieveTranslate,
    getFieldAction,
    getFieldErrors,
  } from "#form/index.js";

  import {
    setCombinationContext,
    type CombinationContext,
    type CombinationContextOptions,
  } from "./context.svelte.js";

  let {
    value = $bindable(),
    config,
    uiOption,
    field,
    restFieldConfig,
    createContext,
    translate,
  }: ComponentProps[F] & {
    field: F;
    createContext: <T>(
      options: Omit<
        CombinationContextOptions<T>,
        "schemas" | "uiSchemas" | "pseudoSuffix"
      >
    ) => CombinationContext;
    restFieldConfig?: Config;
  } = $props();

  const ctx = getFormContext();
  // svelte-ignore state_referenced_locally
  const combinationCtx = createContext({
    ctx,
    config: () => config,
    value: () => value,
    setValue: (v) => (value = v),
    translate: () => translate,
  });
  setCombinationContext(combinationCtx);

  const Template = $derived(getComponent(ctx, "multiFieldTemplate", config));
  const Widget = $derived(getComponent(ctx, "selectWidget", config));

  const RestSchemaField = $derived(
    restFieldConfig && getFieldComponent(ctx, restFieldConfig)
  );

  const combinationFieldConfig = $derived(combinationCtx.fieldConfig());
  const CombinationField = $derived(
    combinationFieldConfig && getFieldComponent(ctx, combinationFieldConfig)
  );

  const action = $derived(getFieldAction(ctx, config, field));
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
  showMeta={restFieldConfig === undefined}
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

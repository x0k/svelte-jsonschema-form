<script
  lang="ts"
  generics="F extends ActionField, T extends FoundationalWidgetType"
>
  import {
    makeEventHandlers,
    getFieldErrors,
    validateField,
    getFormContext,
    getComponent,
    type ComponentProps,
    type Config,
    type UiOption,
    type ActionField,
    getFieldAction,
  } from "@/form/index.js";

  import type { FoundationalWidgetType } from "./widgets.js";

  const ctx = getFormContext();

  type V = ComponentProps[F]["value"];

  let {
    field,
    widgetType,
    value = $bindable(),
    config,
    uiOption,
    fromValue,
    toValue,
    showTitle,
    useLabel,
  }: {
    field: F;
    widgetType: T;
    config: Config;
    uiOption: UiOption;
    value: V;
    fromValue: (v: V) => ComponentProps[T]["value"];
    toValue: (v: ComponentProps[T]["value"]) => V;
    showTitle: boolean;
    useLabel: boolean;
  } = $props();

  const Template = $derived(getComponent(ctx, "fieldTemplate", config));
  const Widget = $derived(getComponent(ctx, widgetType, config));

  const handlers = makeEventHandlers(
    ctx,
    () => config,
    () => validateField(ctx, config, value)
  );

  const errors = $derived(getFieldErrors(ctx, config.path));
  const action = $derived(getFieldAction(ctx, config, field));
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
<Template
  type="template"
  {showTitle}
  {useLabel}
  {widgetType}
  {uiOption}
  {value}
  {config}
  {errors}
  action={action && renderAction}
>
  <Widget
    type="widget"
    {config}
    {errors}
    {uiOption}
    bind:value={
      () => fromValue(value) as undefined, (v) => (value = toValue(v))
    }
    {handlers}
  />
</Template>

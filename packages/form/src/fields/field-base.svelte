<script lang="ts" generics="V extends FieldValue, T extends FoundationalWidgetType">
  import {
    makeEventHandlers,
    getErrors,
    validateField,
    getFormContext,
    getComponent,
    type ComponentProps,
    type Config,
    type FieldValue,
    type UiOption,
  } from "@/form/index.js";

  import type { FoundationalWidgetType } from "./widgets.js";

  const ctx = getFormContext();

  let {
    value = $bindable(),
    config,
    uiOption,
    fromValue,
    toValue,
    widgetType,
    showTitle,
    useLabel,
  }: {
    config: Config;
    uiOption: UiOption;
    value: V;
    widgetType: T;
    fromValue: (v: V) => ComponentProps[T]["value"];
    toValue: (v: ComponentProps[T]["value"]) => V;
    showTitle: boolean;
    useLabel: boolean;
  } = $props();

  const Template = $derived(getComponent(ctx, "fieldTemplate", config));
  const Widget = $derived(getComponent(ctx, widgetType, config));

  const handlers = makeEventHandlers(ctx, () =>
    validateField(ctx, config, value)
  );

  const errors = $derived(getErrors(ctx, config.id));
</script>

<Template
  type="template"
  {showTitle}
  {useLabel}
  {widgetType}
  {uiOption}
  {value}
  {config}
  {errors}
>
  <Widget
    type="widget"
    {config}
    {errors}
    bind:value={
      () => fromValue(value) as undefined, (v) => (value = toValue(v))
    }
    {handlers}
  />
</Template>

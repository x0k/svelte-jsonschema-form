<script lang="ts" generics="V extends FormValue, T extends UnifiedWidgetType">
  import {
    makeEventHandlers,
    getErrors,
    validateField,
    getFormContext,
    getComponent,
    type ComponentProps,
    type Config,
    type FormValue,
  } from "@/form/index.js";

  import type { UnifiedWidgetType } from "./widgets.js";

  const ctx = getFormContext();

  let {
    value = $bindable(),
    config,
    fromValue,
    toValue,
    widgetType,
  }: {
    widgetType: T;
    value: V;
    config: Config;
    fromValue: (v: V) => ComponentProps[T]["value"];
    toValue: (v: ComponentProps[T]["value"]) => V;
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
  showTitle
  useLabel
  {widgetType}
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

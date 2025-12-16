<script lang="ts" module>
  const field = "aggregatedField";
  declare module "../../form/index.js" {
    interface ActionFields {
      [field]: {};
    }
    interface FoundationalComponents {
      aggregatedWidget: {};
    }
  }
</script>

<script lang="ts">
  import {
    type ComponentProps,
    getComponent,
    getFormContext,
    makeEventHandlers,
    validateField,
    getFieldsErrors,
    getFieldErrors,
    type FieldPath,
    getFieldAction,
    getSubtreePaths,
  } from "@/form/index.js";
  import "@/form/extra-fields/aggregated.js";

  import "../extra-widgets/aggregated.js";

  let {
    config,
    value = $bindable(),
    uiOption,
  }: ComponentProps[typeof field] = $props();

  const ctx = getFormContext();

  const Template = $derived(getComponent(ctx, "fieldTemplate", config));
  const widgetType = "aggregatedWidget";
  const Widget = $derived(getComponent(ctx, widgetType, config));

  const handlers = makeEventHandlers(
    ctx,
    () => config,
    () => validateField(ctx, config, value)
  );

  const collectErrors = $derived(uiOption("collectErrors") ?? false);
  const errors = $derived(
    collectErrors
      ? getFieldsErrors(ctx, getSubtreePaths(ctx, config.path))
      : getFieldErrors(ctx, config.path)
  );
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
  showTitle
  useLabel
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
    bind:value={() => value ?? undefined, (v) => (value = v)}
    {handlers}
  />
</Template>

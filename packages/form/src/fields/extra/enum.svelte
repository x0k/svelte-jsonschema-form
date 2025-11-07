<script lang="ts" module>
  const field = "enumField";
  declare module "../../form/index.js" {
    interface ActionFields {
      [field]: {};
    }
  }
</script>

<script lang="ts">
  import {
    type ComponentProps,
    getComponent,
    getFieldAction,
    getFieldErrors,
    getFormContext,
    makeEventHandlers,
    validateField,
  } from "@/form/index.js";
  import "@/form/extra-fields/enum.js";

  import { createOptions } from "../enum.js";

  const {
    config,
    value = $bindable(),
    uiOption,
  }: ComponentProps[typeof field] = $props();

  const ctx = getFormContext();

  const Template = $derived(getComponent(ctx, "fieldTemplate", config));
  const widgetType = "selectWidget";
  const Widget = $derived(getComponent(ctx, widgetType, config));

  const handlers = makeEventHandlers(
    ctx,
    () => config,
    () => validateField(ctx, config, value)
  );
  const options = $derived(
    createOptions(ctx, config, uiOption, config.schema) ?? []
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
  showTitle
  useLabel
  {uiOption}
  {widgetType}
  {value}
  {config}
  {errors}
  action={action && renderAction}
>
  <Widget
    type="widget"
    {handlers}
    {config}
    {errors}
    {uiOption}
    bind:value
    {options}
  />
</Template>

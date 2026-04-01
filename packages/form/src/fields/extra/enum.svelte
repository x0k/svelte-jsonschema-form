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
    makeEventHandlers,
    getFieldErrors,
    validateField,
    getFormContext,
    getComponent,
    type ComponentProps,
    getFieldAction,
  } from "@/form/index.js";
  import "@/form/extra-fields/enum.js";
  import { EMPTY_VALUE, singleOption } from "@/options.svelte.js";

  import { createFormOptions } from "../enum.js";

  let {
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
  const { options, mapper } = $derived(
    createFormOptions(ctx, config, uiOption, config.schema)
  );

  const mapped = singleOption({
    mapper: () => mapper,
    value: () => value,
    update: (v) => (value = v),
  });
  const hasInitialValue = $derived(
    config.schema.default !== undefined ||
      mapper.toValue(EMPTY_VALUE) !== undefined
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
    {mapper}
    {mapped}
    {hasInitialValue}
  />
</Template>

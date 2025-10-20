<script lang="ts" module>
  const field = "multiEnumField";
  declare module "../../form/index.js" {
    interface ActionFields {
      [field]: {};
    }
    interface FoundationalComponents {
      checkboxesWidget: {};
    }
  }
</script>

<script lang="ts">
  import { isSchemaObjectValue } from "@/core/index.js";
  import {
    makeEventHandlers,
    getFieldErrors,
    validateField,
    getFormContext,
    getComponent,
    type ComponentProps,
    getFieldAction,
  } from "@/form/index.js";
  import "@/form/extra-fields/multi-enum.js";

  import { createOptions } from "../enum.js";
  import "../extra-widgets/checkboxes.js";

  let {
    config,
    uiOption,
    value = $bindable(),
  }: ComponentProps[typeof field] = $props();

  const ctx = getFormContext();

  const Template = $derived(getComponent(ctx, "fieldTemplate", config));
  const widgetType = "checkboxesWidget";
  const Widget = $derived(getComponent(ctx, widgetType, config));

  const handlers = makeEventHandlers(ctx, () => config, () =>
    validateField(ctx, config, value)
  );
  const options = $derived.by(() => {
    const { items } = config.schema;
    const itemSchema = isSchemaObjectValue(items) ? items : {};
    return createOptions(ctx, config, uiOption, itemSchema) ?? [];
  });
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
  useLabel={false}
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
    bind:value={() => value ?? undefined, (v) => (value = v)}
    {options}
    {uiOption}
  />
</Template>

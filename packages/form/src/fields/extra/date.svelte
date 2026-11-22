<script lang="ts" module>
  const field = "dateField";
  declare module "../../form/index.js" {
    interface ActionFields {
      [field]: {};
    }
    interface FoundationalComponents {
      dateInputWidget: {};
    }
  }
</script>

<script lang="ts">
  import {
    getComponent,
    getFieldAction,
    getFieldErrors,
    getFormContext,
    makeEventHandlers,
    validateField,
    type ComponentProps,
  } from "#form/index.js";
  import "#form/extra-fields/date.js";

  import { schemaValueDateAccessors } from "../date-time.js";
  import "../extra-widgets/date-input.js";

  let {
    config,
    value = $bindable(),
    uiOption,
  }: ComponentProps[typeof field] = $props();

  const ctx = getFormContext();

  const Template = $derived(getComponent(ctx, "fieldTemplate", config));
  const widgetType = "dateInputWidget";
  const Widget = $derived(getComponent(ctx, widgetType, config));

  const accessors = $derived(schemaValueDateAccessors(config.schema.format));

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
    inputType={accessors.inputType}
    bind:value={() => accessors.get(value), (v) => (value = accessors.set(v))}
    {handlers}
  />
</Template>

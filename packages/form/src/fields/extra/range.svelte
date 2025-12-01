<script lang="ts" module>
  const field = "rangeField";
  const widgetType = "rangePickerWidget";

  declare module "../../form/index.js" {
    interface ActionFields {
      [field]: {};
    }
    interface FoundationalComponents {
      [widgetType]: {};
    }
  }
</script>

<script lang="ts">
  import {
    getChildPath,
    getComponent,
    getFieldAction,
    getFieldErrors,
    getFieldsErrors,
    getFormContext,
    makeEventHandlers,
    validateField,
    type ComponentProps,
    type FieldValue,
  } from "@/form/index.js";
  import "@/form/extra-fields/range.js";

  import "../extra-widgets/range-picker.js";

  let {
    config,
    value = $bindable(),
    uiOption,
  }: ComponentProps[typeof field] = $props();


  const ctx = getFormContext();

  const Template = $derived(getComponent(ctx, "fieldTemplate", config));
  const Widget = $derived(getComponent(ctx, widgetType, config));

  const handlers = makeEventHandlers(
    ctx,
    () => config,
    () => validateField(ctx, config, value as FieldValue)
  );

  const collectErrors = $derived(uiOption("collectErrors") ?? false);

  const paths = $derived.by(() => {
    const path = config.path;
    return [
      path,
      getChildPath(ctx, path, "start"),
      getChildPath(ctx, path, "end"),
    ];
  });

  const errors = $derived(
    collectErrors
      ? getFieldsErrors(ctx, paths)
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
  value={value as FieldValue}
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

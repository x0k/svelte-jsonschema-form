<script lang="ts" module>
  const field = "tagsField";
  declare module "../../form/index.js" {
    interface ActionFields {
      [field]: {};
    }
    interface FoundationalComponents {
      tagsWidget: {};
    }
  }
</script>

<script lang="ts">
  import {
    getComponent,
    getFieldAction,
    getFieldErrors,
    getFieldsErrors,
    getFormContext,
    getSubtreePaths,
    makeEventHandlers,
    validateField,
    type ComponentProps,
  } from "@/form/index.js";
  import "@/form/extra-fields/tags.js";

  import "../extra-widgets/tags.js";

  let {
    config,
    value = $bindable(),
    uiOption,
  }: ComponentProps[typeof field] = $props();

  const widgetType = "tagsWidget";

  const ctx = getFormContext();

  const Template = $derived(getComponent(ctx, "fieldTemplate", config));
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

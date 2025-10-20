<script lang="ts" module>
  import { createArrayComparator } from "@/lib/array.js";
  
  const field = "aggregatedField"
  declare module "../../form/index.js" {
    interface ActionFields {
      [field]: {}
    }
    interface FoundationalComponents {
      aggregatedWidget: {};
    }
  }

  const comparePaths = createArrayComparator((a: FieldPath, b: FieldPath) =>
    a === b ? 0 : 1
  );
  
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
    createChildPath,
    getFieldAction,
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

  let lastPaths: FieldPath[] | undefined;
  const paths = $derived.by(() => {
    const path = config.path;
    const v = value;
    const nextPaths = v
      ? Object.keys(v).map((k) => createChildPath(ctx, path, k))
      : [];
    nextPaths.unshift(path);
    return lastPaths && comparePaths(nextPaths, lastPaths) === 0
      ? lastPaths
      : nextPaths;
  });

  const errors = $derived(
    collectErrors
      ? getFieldsErrors(ctx, paths)
      : getFieldErrors(ctx, config.path)
  );
  const action = $derived(getFieldAction(ctx, config, field))
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

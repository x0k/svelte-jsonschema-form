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
    getChildPath,
    getComponent,
    getFieldAction,
    getFieldErrors,
    getFieldsErrors,
    getFormContext,
    makeEventHandlers,
    validateField,
    type ComponentProps,
    type FieldPath,
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

  let lastPaths: FieldPath[] | undefined;
  const paths = $derived.by(() => {
    const l = value?.length ?? 0;
    const path = config.path;
    if (lastPaths?.length === l + 1 && lastPaths[0] === path) {
      return lastPaths;
    }
    const paths = [path];
    for (let i = 0; i < l; i++) {
      paths.push(getChildPath(ctx, path, i));
    }
    return paths;
  });

  const errors = $derived(
    collectErrors ? getFieldsErrors(ctx, paths) : getFieldErrors(ctx, config.path)
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

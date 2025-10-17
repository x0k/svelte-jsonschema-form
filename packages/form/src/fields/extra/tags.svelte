<script lang="ts" module>
  declare module "../../form/index.js" {
    interface FoundationalComponents {
      tagsWidget: {};
    }
  }
</script>

<script lang="ts">
  import {
    createChildPath,
    getComponent,
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
  }: ComponentProps["tagsField"] = $props();

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
      paths.push(createChildPath(ctx, path, i));
    }
    return paths;
  });

  const errors = $derived(
    collectErrors ? getFieldsErrors(ctx, paths) : getFieldErrors(ctx, config.path)
  );
</script>

<Template
  type="template"
  showTitle
  useLabel
  {widgetType}
  {uiOption}
  {value}
  {config}
  {errors}
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

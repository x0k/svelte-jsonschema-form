<script lang="ts" module>
  declare module "../../form/index.js" {
    interface FoundationalComponents {
      tagsWidget: {};
    }
  }
</script>

<script lang="ts">
  import {
    getComponent,
    getErrors,
    getErrorsForIds,
    getFormContext,
    idFromPath,
    makeEventHandlers,
    validateField,
    type ComponentProps,
    type Id,
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

  let lastIds: Id[] | undefined;
  const ids = $derived.by(() => {
    const l = value?.length ?? 0;
    const id = config.id;
    if (lastIds?.length === l + 1 && lastIds[0] === id) {
      return lastIds;
    }
    const ids = [id];
    for (let i = 0; i < l; i++) {
      ids.push(idFromPath(ctx, config.path.concat(i)));
    }
    return ids;
  });

  const errors = $derived(
    collectErrors ? getErrorsForIds(ctx, ids) : getErrors(ctx, config.id)
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

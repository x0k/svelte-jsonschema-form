<script lang="ts" module>
  import { createArrayComparator } from "@/lib/array.js";
  import { ascComparator } from "@/lib/ord.js";

  declare module "../../form/index.js" {
    interface FoundationalComponents {
      aggregatedWidget: {};
    }
  }

  const compareIds = createArrayComparator(ascComparator);
</script>

<script lang="ts">
  import {
    type Id,
    type ComponentProps,
    getComponent,
    getFormContext,
    makeEventHandlers,
    validateField,
    createChildId,
    getErrorsForIds,
    getErrors,
  } from "@/form/index.js";
  import "@/form/extra-fields/aggregated.js";

  import "../extra-widgets/aggregated.js";

  let {
    config,
    value = $bindable(),
    uiOption,
  }: ComponentProps["aggregatedField"] = $props();

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

  let lastIds: Id[] | undefined;
  const ids = $derived.by(() => {
    const id = config.id;
    const v = value;
    const nextIds = v
      ? Object.keys(v).map((k) => createChildId(id, k, ctx))
      : [];
    nextIds.unshift(id);
    return lastIds && compareIds(nextIds, lastIds) === 0 ? lastIds : nextIds;
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

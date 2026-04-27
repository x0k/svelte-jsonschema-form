<script lang="ts" module>
  import type { FieldCommonProps, SchemaValue } from "@/form/index.js";

  const field = "objectKeyEnumField";
  declare module "../../form/index.js" {
    interface ComponentProps {
      [field]: FieldCommonProps<SchemaValue>;
    }
    interface ComponentBindings {
      [field]: "value";
    }
    interface ActionFields {
      [field]: {};
    }
  }
</script>

<script lang="ts">
  import {
    getComponent,
    getFieldErrors,
    getFormContext,
    type ComponentProps,
    getFieldAction,
    makeEventHandlers,
    validateField,
  } from "@/form/index.js";
  import { singleOption } from "@/options.svelte.js";

  import { getObjectContext } from "../object/context.svelte.js";
  import { createFormOptions } from "../enum.js";

  let {
    config,
    value = $bindable(),
    uiOption,
  }: ComponentProps[typeof field] = $props();

  const ctx = getFormContext();
  const objCtx = getObjectContext();

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

  const availableOptions = $derived(
    options.filter(
      (o) =>
        o.value === value ||
        (typeof o.value === "string" && objCtx.isAvailablePropertyKey(o.value))
    )
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
  {value}
  {config}
  {errors}
  {uiOption}
  action={action && renderAction}
>
  <Widget
    type="widget"
    {errors}
    {handlers}
    {config}
    {uiOption}
    bind:value
    options={availableOptions}
    {mapper}
    {mapped}
    clearable={false}
    hasInitialValue={true}
  />
</Template>

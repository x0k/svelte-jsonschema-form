<script lang="ts" module>
  import type { EnumOption } from "@/core/index.js";
  import type { Query } from "@/lib/task.svelte.js";

  const field = "asyncEnumField";
  declare module "../../form/index.js" {
    interface ActionFields {
      [field]: {};
    }
    interface UiOptions {
      enumOptionsQuery?: Query<any, EnumOption<SchemaValue>[], any>;
    }
  }
</script>

<script lang="ts">
  import {
    getFormContext,
    type ComponentProps,
    type SchemaValue,
    type FormEnumOption,
    getFieldErrors,
    getFieldAction,
    getComponent,
    makeEventHandlers,
    validateField,
  } from "@/form/index.js";
  import "@/form/extra-fields/async-enum.js";
  import {
    EMPTY_VALUE,
    IdEnumValueMapperBuilder,
    singleOption,
  } from "@/options.svelte.js";

  let {
    config,
    value = $bindable(),
    uiOption,
  }: ComponentProps[typeof field] = $props();

  const ctx = getFormContext();

  const Template = $derived(getComponent(ctx, "fieldTemplate", config));
  const widgetType = "selectWidget";
  const Widget = $derived(getComponent(ctx, widgetType, config));

  const handlers = makeEventHandlers(
    ctx,
    () => config,
    () => validateField(ctx, config, value)
  );

  const optionsQuery = $derived.by(() => {
    const query = uiOption("enumOptionsQuery");
    if (query === undefined) {
      throw new Error(
        `async enum field (${config.path.join(".")}): 'enumOptionsQuery' is undefined`
      );
    }
    return query;
  });
  let originalOptions = $derived(optionsQuery.result ?? []);

  const { options, mapper } = $derived.by(() => {
    const builder =
      uiOption("enumValueMapperBuilder")?.() ?? new IdEnumValueMapperBuilder();
    const options: FormEnumOption[] = originalOptions.map((o) => ({
      ...o,
      mappedValue: builder.push(o),
    }));
    return { options, mapper: builder.build() };
  });
  const mapped = singleOption({
    mapper: () => mapper,
    value: () => value,
    update: (v) => (value = v),
  });
  const hasInitialValue = $derived(
    config.schema.default !== undefined ||
      mapper.toValue(EMPTY_VALUE) !== undefined
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
    {uiOption}
    bind:value
    {options}
    {mapper}
    {mapped}
    {hasInitialValue}
  />
</Template>

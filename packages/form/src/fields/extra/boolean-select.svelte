<script lang="ts" module>
  const field = "booleanSelectField";
  declare module "../../form/index.js" {
    interface ActionFields {
      [field]: {};
    }
  }
</script>

<script lang="ts">
  import {
    makeEventHandlers,
    getFieldErrors,
    validateField,
    getFormContext,
    getComponent,
    type ComponentProps,
    type Schema,
    DEFAULT_BOOLEAN_ENUM,
    getPseudoId,
    getFieldAction,
    type FormEnumOption,
  } from "@/form/index.js";
  import "@/form/extra-fields/boolean-select.js";
  import { IdEnumValueMapperBuilder, singleOption } from "@/options.svelte.js";

  import { createFormOptions } from "../enum.js";

  const ctx = getFormContext();

  let {
    config,
    value = $bindable(),
    uiOption,
    translate,
  }: ComponentProps[typeof field] = $props();

  const Template = $derived(getComponent(ctx, "fieldTemplate", config));
  const widgetType = "selectWidget";
  const Widget = $derived(getComponent(ctx, widgetType, config));

  const { options, mapper } = $derived.by(() => {
    const yes = translate("yes", {});
    const no = translate("no", {});
    if (Array.isArray(config.schema.oneOf)) {
      return createFormOptions(ctx, config, uiOption, {
        oneOf: config.schema.oneOf.map((option): Schema => {
          if (typeof option === "boolean") {
            return option
              ? { const: true, title: yes }
              : { const: false, title: no };
          }
          return {
            ...option,
            title: option.title ?? (option.const === true ? yes : no),
          };
        }),
      });
    }
    const enumValues = config.schema.enum ?? DEFAULT_BOOLEAN_ENUM;
    if (
      enumValues.length === 2 &&
      enumValues.every((v) => typeof v === "boolean") &&
      uiOption("enumNames") === undefined
    ) {
      const builder =
        uiOption("enumValueMapperBuilder")?.() ??
        new IdEnumValueMapperBuilder();
      const options = enumValues.map((v, i) => {
        const option: FormEnumOption = {
          id: getPseudoId(ctx, config.path, i),
          label: v ? yes : no,
          value: v,
          disabled: false,
        };
        option.mappedValue = builder.push(option);
        return option;
      });
      return { options, mapper: builder.build() };
    }
    return createFormOptions(
      ctx,
      config,
      uiOption,
      Object.setPrototypeOf({ enum: enumValues }, config.schema)
    );
  });

  const mapped = singleOption({
    mapper: () => mapper,
    value: () => value ?? undefined,
    update: (v) => (value = v === undefined ? undefined : Boolean(v)),
  });
  const clearable = $derived(
    uiOption("clearable") ?? config.schema.default === undefined
  );

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
  {uiOption}
  {widgetType}
  {value}
  {config}
  {errors}
  action={action && renderAction}
>
  <Widget
    type="widget"
    {options}
    {mapper}
    {mapped}
    bind:value
    {errors}
    {handlers}
    {uiOption}
    {config}
    {clearable}
    hasInitialValue={!clearable}
  />
</Template>

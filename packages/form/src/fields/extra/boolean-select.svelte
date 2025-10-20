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
    createPseudoId,
    getFieldAction,
  } from "@/form/index.js";
  import "@/form/extra-fields/boolean-select.js";

  import { createOptions } from "../enum.js";

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

  const options = $derived.by(() => {
    const yes = translate("yes", {});
    const no = translate("no", {});
    if (Array.isArray(config.schema.oneOf)) {
      return (
        createOptions(ctx, config, uiOption, {
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
        }) ?? []
      );
    }
    const enumValues = config.schema.enum ?? DEFAULT_BOOLEAN_ENUM;
    if (
      enumValues.length === 2 &&
      enumValues.every((v) => typeof v === "boolean") &&
      uiOption("enumNames") === undefined
    ) {
      return enumValues.map((v, i) => {
        return {
          id: createPseudoId(ctx, config.path, i),
          label: v ? yes : no,
          value: v,
          disabled: false,
        };
      });
    }
    return (
      createOptions(
        ctx,
        config,
        uiOption,
        Object.setPrototypeOf({ enum: enumValues }, config.schema)
      ) ?? []
    );
  });

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
    bind:value
    {errors}
    {handlers}
    {uiOption}
    {config}
  />
</Template>

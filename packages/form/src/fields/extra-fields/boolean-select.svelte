<script lang="ts">
  import {
    makeEventHandlers,
    getErrors,
    validateField,
    getFormContext,
    getComponent,
    type ComponentProps,
    createPseudoId,
    type Schema,
    DEFAULT_BOOLEAN_ENUM,
    translate,
  } from "@/form/index.js";
  import "@/form/extra-fields/boolean-select.js";

  import { createOptions } from "../enum.js";

  const ctx = getFormContext();

  let { config, value = $bindable() }: ComponentProps["booleanSelectField"] =
    $props();

  const Template = $derived(getComponent(ctx, "fieldTemplate", config));
  const widgetType = "selectWidget";
  const Widget = $derived(getComponent(ctx, widgetType, config));

  const options = $derived.by(() => {
    const yes = translate(ctx, "yes", {});
    const no = translate(ctx, "no", {});
    if (Array.isArray(config.schema.oneOf)) {
      return (
        createOptions(ctx, config, {
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
      config.uiOptions?.enumNames === undefined
    ) {
      return enumValues.map((v, i) => ({
        id: createPseudoId(config.id, i, ctx),
        label: v ? yes : no,
        value: v,
        disabled: false,
      }));
    }
    return createOptions(ctx, config, config.schema) ?? [];
  });

  const handlers = makeEventHandlers(ctx, () =>
    validateField(ctx, config, value)
  );
  const errors = $derived(getErrors(ctx, config.id));
</script>

<Template
  type="template"
  showTitle
  useLabel
  {widgetType}
  {value}
  {config}
  {errors}
>
  <Widget type="widget" {options} bind:value {errors} {handlers} {config} />
</Template>

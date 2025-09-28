<script lang="ts">
  import {
    makeEventHandlers,
    getErrors,
    validateField,
    getFormContext,
    getComponent,
    type ComponentProps,
    type Schema,
    DEFAULT_BOOLEAN_ENUM,
    idFromPath,
    encodePseudoElement,
  } from "@/form/index.js";
  import "@/form/extra-fields/boolean-select.js";

  import { createOptions } from "../enum.js";

  const ctx = getFormContext();

  let {
    config,
    value = $bindable(),
    uiOption,
    translate,
  }: ComponentProps["booleanSelectField"] = $props();

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
      const x = config.path.length;
      const tmpPath = config.path.concat("");
      return enumValues.map((v, i) => {
        tmpPath[x] = encodePseudoElement(i);
        return {
          id: idFromPath(ctx, tmpPath),
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
  const errors = $derived(getErrors(ctx, config.id));
</script>

<Template
  type="template"
  showTitle
  useLabel
  {uiOption}
  {widgetType}
  {value}
  {config}
  {errors}
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

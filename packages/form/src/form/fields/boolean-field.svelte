<script lang="ts">
  import { type Schema } from "@/core/index.js";

  import {
    getTemplate,
    makeEventHandlers,
    getErrors,
    validateField,
    getFormContext,
    makePseudoId,
    getWidget,
  } from "../context/index.js";
  import { createOptions2, DEFAULT_BOOLEAN_ENUM } from "../enum.js";

  import type { FieldProps } from "./model.js";

  const ctx = getFormContext();

  let { config, value = $bindable() }: FieldProps<"boolean"> = $props();

  const Template = $derived(getTemplate(ctx, "field", config));
  const Widget = $derived(getWidget(ctx, "checkbox", config));
  const options = $derived.by(() => {
    const yes = ctx.translation("yes");
    const no = ctx.translation("no");
    const computeId = (i: number) => makePseudoId(ctx, config.idSchema.$id, i);
    if (Array.isArray(config.schema.oneOf)) {
      return (
        createOptions2(
          {
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
          },
          config.idSchema,
          config.uiOptions,
          computeId
        ) ?? []
      );
    }
    const enumValues = config.schema.enum ?? DEFAULT_BOOLEAN_ENUM;
    if (
      enumValues.length === 2 &&
      enumValues.every((v) => typeof v === "boolean") &&
      config.uiOptions?.enumNames === undefined
    ) {
      return enumValues.map((v, i) => ({
        id: makePseudoId(ctx, config.idSchema.$id, i),
        label: v ? yes : no,
        value: v,
        disabled: false,
      }));
    }
    return (
      createOptions2(
        config.schema,
        config.idSchema,
        config.uiOptions,
        computeId
      ) ?? []
    );
  });

  const handlers = makeEventHandlers(ctx, () =>
    validateField(ctx, config, value)
  );
  const errors = $derived(getErrors(ctx, config.idSchema));
</script>

<Template
  {errors}
  showTitle={config.uiOptions?.hideTitle === false}
  {value}
  {config}
>
  <Widget bind:value {errors} {handlers} {options} {config} />
</Template>

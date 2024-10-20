<script lang="ts">
  import { type Schema } from "@/core/index.js";

  import {
    getTemplate,
    getWidget,
    inputAttributes,
    makeEventHandlers,
    getErrors,
    validateField,
    getFormContext,
  } from "../context/index.js";
  import { createOptions } from "../enum.js";
  import { computeId } from "../id-schema.js";

  import type { FieldProps } from "./model.js";

  const ctx = getFormContext();

  let { config, value = $bindable() }: FieldProps<"boolean"> = $props();

  const Template = $derived(getTemplate(ctx, "field", config));
  const Widget = $derived(getWidget(ctx, "checkbox", config));
  const options = $derived.by(() => {
    const yes = ctx.translation("yes");
    const no = ctx.translation("no");
    if (Array.isArray(config.schema.oneOf)) {
      return (
        createOptions(
          {
            oneOf: config.schema.oneOf
              .map((option): Schema | undefined => {
                if (typeof option === "boolean") {
                  return undefined;
                }
                return {
                  ...option,
                  title: option.title ?? (option.const === true ? yes : no),
                };
              })
              .filter((s): s is Schema => s !== undefined),
          },
          config.idSchema,
          config.uiSchema,
          config.uiOptions
        ) ?? []
      );
    }
    const enumValues = config.schema.enum ?? [true, false];
    if (
      enumValues.length === 2 &&
      enumValues.every((v) => typeof v === "boolean") &&
      config.uiOptions?.enumNames === undefined
    ) {
      return enumValues.map((v, i) => ({
        id: computeId(config.idSchema, i),
        label: v ? yes : no,
        value: v,
        disabled: false,
      }));
    }
    return (
      createOptions(
        config.schema,
        config.idSchema,
        config.uiSchema,
        config.uiOptions
      ) ?? []
    );
  });

  const handlers = makeEventHandlers(ctx, () =>
    validateField(ctx, config, value)
  );
  const attributes = $derived(inputAttributes(ctx, config, handlers));
  const errors = $derived(getErrors(ctx, config.idSchema));
</script>

<Template
  {errors}
  showTitle={config.uiOptions?.hideTitle === false}
  {value}
  {config}
>
  <Widget bind:value {errors} {attributes} {options} {config} />
</Template>

<script lang="ts">
  import { createOptions, type Schema } from "@/core";
  
  import { getFormContext } from "../context";
  import { getTemplate } from "../templates";
  import { getWidget } from "../widgets";
  import { getErrors } from '../utils';

  import type { FieldProps } from "./model";
  import { inputAttributes } from "./make-widget-attributes";

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
      return enumValues.map((v) => ({
        label: v ? yes : no,
        value: v,
        disabled: false,
      }));
    }
    return (
      createOptions(config.schema, config.uiSchema, config.uiOptions) ?? []
    );
  });
  const attributes = $derived(inputAttributes(ctx, config));
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

<script lang="ts">
  import { getFormContext } from "../context";
  import { createOptions } from "../enum";
  import { type Schema } from "../schema";
  import { getTemplate } from "../templates";
  import { getWidget } from "../widgets";

  import type { FieldProps } from "./model";
  import { inputAttributes, makeAttributes } from "./make-widget-attributes";

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
          config.uiSchema
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
      }));
    }
    return createOptions(config.schema, config.uiSchema) ?? [];
  });
  const attributes = $derived(makeAttributes(ctx, config, inputAttributes));
</script>

<Template
  showTitle={false}
  {value}
  {config}
>
  <Widget bind:value {attributes} {options} {config} />
</Template>

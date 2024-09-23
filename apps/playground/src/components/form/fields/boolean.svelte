<script lang="ts">
  import { getFormContext } from "../context";
  import { createOptions } from "../enum";
  import { type Schema } from "../schema";
  import { getWidget, getWidgetProps } from "../utils";

  import type { FieldProps } from "./model";

  const ctx = getFormContext();

  let {
    name,
    value = $bindable(),
    schema,
    uiSchema,
    idSchema,
    required,
  }: FieldProps<"boolean"> = $props();

  const Widget = $derived(getWidget(ctx, "checkbox", uiSchema));
  const options = $derived.by(() => {
    const yes = ctx.translation("yes");
    const no = ctx.translation("no");
    if (Array.isArray(schema.oneOf)) {
      return createOptions(
        {
          oneOf: schema.oneOf
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
        uiSchema
      );
    }
    const enumValues = schema.enum ?? [true, false];
    if (
      enumValues.length === 2 &&
      enumValues.every((v) => typeof v === "boolean") &&
      uiSchema["ui:options"]?.enumNames === undefined
    ) {
      return enumValues.map((v) => ({
        label: v ? yes : no,
        value: v,
      }));
    }
    return createOptions(schema, uiSchema);
  });
</script>

<Widget
  bind:value
  {...getWidgetProps(ctx, name, schema, uiSchema, idSchema)}
  {options}
  {required}
/>

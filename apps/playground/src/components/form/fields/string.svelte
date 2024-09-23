<script lang="ts">
  import { getFormContext } from "../context";
  import { createOptions } from "../enum";
  import { getWidget, getWidgetProps, isSelect } from "../utils";

  import type { FieldProps } from "./model";

  const ctx = getFormContext();
  let {
    name,
    value = $bindable(),
    schema,
    uiSchema,
    idSchema,
    required,
  }: FieldProps<"string"> = $props();
  const [Widget, widgetProps] = $derived.by(() => {
    const type = isSelect(ctx, schema) ? "select" : "text";
    switch (type) {
      case "select":
        return [
          getWidget(ctx, "select", uiSchema),
          { options: createOptions(schema, uiSchema) },
        ] as const;
      case "text":
        return [getWidget(ctx, "text", uiSchema), {}] as const;
      default:
        throw new Error(`Unsupported type: ${type}`);
    }
  });
</script>

<Widget
  bind:value
  {...getWidgetProps(ctx, name, schema, uiSchema, idSchema)}
  {...widgetProps}
  {required}
/>

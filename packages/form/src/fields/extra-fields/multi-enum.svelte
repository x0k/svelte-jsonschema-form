<script lang="ts" module>
  declare module "../../form/index.js" {
    interface FoundationalComponents {
      checkboxesWidget: {};
    }
  }
</script>

<script lang="ts">
  import { isSchemaObjectValue } from "@/core/index.js";
  import {
    makeEventHandlers,
    getErrors,
    validateField,
    getFormContext,
    createPseudoId,
    getComponent,
    type ComponentProps,
  } from "@/form/index.js";
  import "@/form/extra-fields/multi-enum.js";

  import { createOptions } from "../enum.js";
  import "../extra-widgets/checkboxes.js";

  let { config, value = $bindable() }: ComponentProps["multiEnumField"] =
    $props();

  const ctx = getFormContext();

  const Template = $derived(getComponent(ctx, "fieldTemplate", config));
  const widgetType = "checkboxesWidget";
  const Widget = $derived(getComponent(ctx, widgetType, config));

  const handlers = makeEventHandlers(ctx, () =>
    validateField(ctx, config, value)
  );
  const options = $derived.by(() => {
    const { items } = config.schema;
    const itemSchema = isSchemaObjectValue(items) ? items : {};
    return (
      createOptions(itemSchema, config.uiSchema, config.uiOptions, (i) =>
        createPseudoId(config.id, i, ctx)
      ) ?? []
    );
  });
  const errors = $derived(getErrors(ctx, config.id));
</script>

<Template showTitle {widgetType} {value} {config} {errors}>
  <Widget {handlers} {config} {errors} bind:value {options} />
</Template>

<script lang="ts">
  import { createOptions } from "../enum.js";
  import { getFormContext } from "../context.js";
  import { getTemplate } from "../templates/index.js";
  import { getWidget } from "../widgets.js";
  import { getErrors } from "../utils.js";

  import type { FieldProps } from "./model.js";
  import { selectAttributes } from "./make-widget-attributes.js";

  let {
    config,
    value = $bindable(),
    multiple = false,
  }: FieldProps<"enum"> = $props();

  const ctx = getFormContext();

  const Template = $derived(getTemplate(ctx, "field", config));
  const Widget = $derived(getWidget(ctx, "select", config));

  const attributes = $derived(selectAttributes(ctx, config));
  const options = $derived(
    createOptions(config.schema, config.uiSchema, config.uiOptions) ?? []
  );
  const errors = $derived(getErrors(ctx, config.idSchema));
</script>

<Template showTitle {value} {config} {errors}>
  <Widget {attributes} {config} {errors} bind:value {options} {multiple} />
</Template>

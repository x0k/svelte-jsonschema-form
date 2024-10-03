<script lang="ts">
  import { getFormContext } from "../context";
  import { createOptions } from "../enum";
  import { getTemplate } from "../templates";
  import { getWidget } from "../widgets";

  import type { FieldProps } from "./model";
  import { selectAttributes } from "./make-widget-attributes";

  let {
    config,
    value = $bindable(),
    multiple = false,
  }: FieldProps<"enum"> = $props();

  const ctx = getFormContext();

  const Template = $derived(getTemplate(ctx, "field", config));
  const Widget = $derived(getWidget(ctx, "select", config));

  const attributes = $derived(selectAttributes(ctx, config));
  const options = $derived(createOptions(config.schema, config.uiSchema, config.uiOptions) ?? []);
  const errors = $derived(ctx.errors.get(config.idSchema.$id) ?? []);
</script>

<Template showTitle {value} {config} {errors}>
  <Widget {attributes} {config} {errors} bind:value {options} {multiple} />
</Template>

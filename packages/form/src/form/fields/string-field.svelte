<script lang="ts">
  import { getFormContext } from "../context.js";
  import { getTemplate } from "../templates/index.js";
  import { getWidget } from "../widgets.js";
  import { getErrors } from '../utils.js';

  import type { FieldProps } from "./model.js";
  import { inputAttributes } from "./make-widget-attributes.js";

  let { config, value = $bindable() }: FieldProps<"string"> = $props();

  const ctx = getFormContext();

  const Template = $derived(getTemplate(ctx, "field", config));
  const Widget = $derived(getWidget(ctx, "text", config));

  const attributes = $derived(inputAttributes(ctx, config));

  const redacted = {
    get value() {
      return value;
    },
    set value(v) {
      value =
        v === "" ? (config.uiOptions?.emptyValue as string | undefined) : v;
    },
  };

  const errors = $derived(getErrors(ctx, config.idSchema));
</script>

<Template showTitle value={redacted.value} {config} {errors}>
  <Widget {errors} {config} bind:value={redacted.value} {attributes} />
</Template>

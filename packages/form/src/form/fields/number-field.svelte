<script lang="ts">
  import { getFormContext } from "../context.js";
  import { getTemplate } from "../templates/index.js";
  import { getWidget } from "../widgets.js";
  import { getErrors } from '../utils.js';

  import type { FieldProps } from "./model.js";
  import { inputAttributes } from "./make-widget-attributes.js";

  const ctx = getFormContext();

  let { value = $bindable(), config }: FieldProps<"number"> = $props();

  const Template = $derived(getTemplate(ctx, "field", config));
  const Widget = $derived(getWidget(ctx, "number", config));

  const attributes = $derived(inputAttributes(ctx, config));

  const redacted = {
    get value() {
      return value;
    },
    set value(v) {
      value =
        v === null ? (config.uiOptions?.emptyValue as number | undefined) : v;
    },
  };

  const errors = $derived(getErrors(ctx, config.idSchema));
</script>

<Template {errors} showTitle value={redacted.value} {config}>
  <Widget {config} {errors} bind:value={redacted.value} {attributes} />
</Template>

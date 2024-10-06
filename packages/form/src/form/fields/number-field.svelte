<script lang="ts">
  import { getFormContext } from "../context";
  import { getTemplate } from "../templates";
  import { getWidget } from "../widgets";
  import { getErrors } from '../utils';

  import type { FieldProps } from "./model";
  import { inputAttributes } from "./make-widget-attributes";

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

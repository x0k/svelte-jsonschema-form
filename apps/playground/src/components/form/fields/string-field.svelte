<script lang="ts">
  import { getFormContext } from "../context";
  import { getTemplate } from "../templates";
  import { getWidget } from "../widgets";

  import type { FieldProps } from "./model";
  import { inputAttributes } from "./make-widget-attributes";

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

  const errors = $derived(ctx.errors.get(config.idSchema.$id) ?? []);
</script>

<Template showTitle value={redacted.value} {config} {errors}>
  <Widget {errors} {config} bind:value={redacted.value} {attributes} />
</Template>

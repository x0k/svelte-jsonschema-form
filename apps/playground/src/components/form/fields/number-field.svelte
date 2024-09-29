<script lang="ts">
  import { getFormContext } from "../context";
  import { getTemplate } from "../templates";
  import { getWidget } from "../widgets";

  import type { FieldProps } from "./model";
  import { inputAttributes } from "./make-widget-attributes";

  const ctx = getFormContext();

  let { value = $bindable(), config }: FieldProps<"number"> = $props();

  const Template = $derived(getTemplate(ctx, "field", config));
  const Widget = $derived(getWidget(ctx, "number", config));

  const attributes = $derived(inputAttributes(ctx, config));
</script>

<Template showTitle {value} {config}>
  <Widget {config} bind:value {attributes} />
</Template>

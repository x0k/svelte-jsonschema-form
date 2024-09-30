<script lang="ts">
  import { proxy } from "@/lib/svelte.svelte";

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

  const redacted = proxy<number | null | undefined>(() => value, {
    update(v) {
      value =
        v === null ? (config.uiOptions?.emptyValue as number | undefined) : v;
    },
  });
</script>

<Template showTitle value={redacted.value} {config}>
  <Widget {config} bind:value={redacted.value} {attributes} />
</Template>

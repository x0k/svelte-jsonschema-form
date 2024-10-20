<script lang="ts">
  import {
    inputAttributes,
    makeEventHandlers,
    getErrors,
    validateField,
    getFormContext,
  } from "../context/index.js";
  import { getTemplate } from "../templates/index.js";
  import { getWidget } from "../widgets.js";

  import type { FieldProps } from "./model.js";
  import Datalist, { makeExamples } from "./datalist.svelte";

  let { config, value = $bindable() }: FieldProps<"string"> = $props();

  const ctx = getFormContext();

  const Template = $derived(getTemplate(ctx, "field", config));
  const Widget = $derived(getWidget(ctx, "text", config));

  const handlers = makeEventHandlers(ctx, () =>
    validateField(ctx, config, value)
  );
  const attributes = $derived(inputAttributes(ctx, config, handlers));

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

  const examples = $derived(makeExamples(config, attributes));
</script>

<Template showTitle value={redacted.value} {config} {errors}>
  <Widget {errors} {config} bind:value={redacted.value} {attributes} />
  <Datalist {examples} />
</Template>

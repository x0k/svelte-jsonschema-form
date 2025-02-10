<script lang="ts">
  import { proxy } from "@/lib/svelte.svelte";
  import type { SchemaValue } from "@/core/index.js";

  import {
    type UiSchema,
    type Config,
    type IdSchema,
    getErrors,
    getUiOptions,
    getFormContext,
    makePseudoId,
    getComponent,
    NO_OPTIONS,
  } from "@/form/index.js";

  import { getObjectContext } from "./context.js";
  import { getWidget } from "../widgets.js";

  const {
    property,
    name,
    uiSchema,
    idSchema,
  }: {
    property: string;
    name: string;
    uiSchema: UiSchema;
    idSchema: IdSchema<SchemaValue>;
  } = $props();

  const ctx = getFormContext();
  const objCtx = getObjectContext();

  const id = $derived(
    makePseudoId(ctx, idSchema?.$id ?? ctx.idPrefix, "key-input")
  );
  const uiOptions = $derived(getUiOptions(ctx, uiSchema));
  const config: Config = $derived({
    name: id,
    title: `${name} Key`,
    schema: { type: "string" },
    idSchema: { $id: id },
    uiSchema,
    uiOptions,
    required: true,
  });

  const Template = $derived(getComponent(ctx, "fieldTemplate", config));
  const Widget = $derived(getWidget(ctx, "textWidget", config));

  const key = proxy<string | undefined>(() => property);

  const handlers = {
    onblur: () => {
      if (!key.value || key.value === property) {
        return;
      }
      objCtx.renameProperty(property, key.value, config);
    },
  };

  const errors = $derived(getErrors(ctx, config.idSchema));
</script>

<Template {errors} showTitle value={property} {config}>
  <Widget
    options={NO_OPTIONS}
    {errors}
    {handlers}
    {config}
    bind:value={key.value}
  />
</Template>

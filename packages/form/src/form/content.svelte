<script lang="ts">
  import { getRootSchema } from "#core/index.js";

  import type { Config } from "./config.js";
  import HiddenIdPrefixInput from "./hidden-id-prefix-input.svelte";
  import { FORM_ROOT_PATH, FORM_UI_SCHEMA, FORM_VALUE } from "./internals.js";
  import {
    getFormContext,
    getFieldComponent,
    getValue,
    retrieveSchema,
    retrieveUiOption,
    uiTitleOption,
    retrieveTranslate,
    getStableConfig,
  } from "./state/index.js";

  const ctx = getFormContext();

  const retrievedSchema = $derived(
    retrieveSchema(ctx, getRootSchema(ctx), getValue(ctx))
  );

  const config: Config = $derived(
    getStableConfig(ctx, {
      path: ctx[FORM_ROOT_PATH],
      title:
        uiTitleOption(ctx, ctx[FORM_UI_SCHEMA]) ?? retrievedSchema.title ?? "",
      schema: retrievedSchema,
      uiSchema: ctx[FORM_UI_SCHEMA],
      required: true,
      value: () => ctx[FORM_VALUE].get(),
    })
  );

  const Field = $derived(getFieldComponent(ctx, config));
</script>

<HiddenIdPrefixInput form={ctx} />
<Field
  type="field"
  bind:value={
    () => ctx[FORM_VALUE].get() as undefined, (v) => ctx[FORM_VALUE].replace(v)
  }
  {config}
  uiOption={(opt) => retrieveUiOption(ctx, config, opt)}
  translate={retrieveTranslate(ctx, config)}
/>

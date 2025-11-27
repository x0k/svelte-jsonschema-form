<script lang="ts">
  import {
    FORM_RETRIEVED_SCHEMA,
    FORM_ROOT_PATH,
    FORM_UI_SCHEMA,
    FORM_VALUE,
  } from "./internals.js";
  import type { Config } from "./config.js";
  import {
    getFormContext,
    getFieldComponent,
    retrieveUiOption,
    uiTitleOption,
    retrieveTranslate,
  } from "./state/index.js";
  import HiddenIdPrefixInput from "./hidden-id-prefix-input.svelte";

  const ctx = getFormContext();

  const config: Config = $derived({
    path: ctx[FORM_ROOT_PATH],
    title:
      uiTitleOption(ctx, ctx[FORM_UI_SCHEMA]) ??
      ctx[FORM_RETRIEVED_SCHEMA].title ??
      "",
    schema: ctx[FORM_RETRIEVED_SCHEMA],
    uiSchema: ctx[FORM_UI_SCHEMA],
    required: true,
  });

  const Field = $derived(getFieldComponent(ctx, config));
</script>

<HiddenIdPrefixInput form={ctx} />
<Field
  type="field"
  bind:value={ctx[FORM_VALUE] as undefined}
  {config}
  uiOption={(opt) => retrieveUiOption(ctx, config, opt)}
  translate={retrieveTranslate(ctx, config)}
/>

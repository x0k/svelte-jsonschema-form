<script lang="ts">
  import type { Ref } from "#lib/svelte.svelte.js";

  import type { Config } from "./config.js";
  import HiddenIdPrefixInput from "./hidden-id-prefix-input.svelte";
  import {
    FORM_RETRIEVED_SCHEMA,
    FORM_ROOT_PATH,
    FORM_UI_SCHEMA,
    FORM_VALUE,
  } from "./internals.js";
  import type { FormValue } from "./model.js";
  import {
    getFormContext,
    getFieldComponent,
    retrieveUiOption,
    uiTitleOption,
    retrieveTranslate,
    getStableConfig,
  } from "./state/index.js";

  const ctx = getFormContext();

  const valueRef: Ref<FormValue> = {
    get current() {
      return ctx[FORM_VALUE].get();
    },
    set current(v) {
      ctx[FORM_VALUE].replace(v);
    },
  };

  const config: Config = $derived(
    getStableConfig(ctx, {
      path: ctx[FORM_ROOT_PATH],
      title:
        uiTitleOption(ctx, ctx[FORM_UI_SCHEMA]) ??
        ctx[FORM_RETRIEVED_SCHEMA].title ??
        "",
      schema: ctx[FORM_RETRIEVED_SCHEMA],
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
  bind:value={valueRef.current as undefined}
  {config}
  uiOption={(opt) => retrieveUiOption(ctx, config, opt)}
  translate={retrieveTranslate(ctx, config)}
/>

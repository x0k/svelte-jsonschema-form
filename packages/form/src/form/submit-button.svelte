<script lang="ts">
  import { FORM_ROOT_PATH, FORM_SCHEMA, FORM_UI_SCHEMA } from "./internals.js";
  import {
    createPseudoPath,
    getComponent,
    getFormContext,
    retrieveTranslate,
  } from "./state/index.js";
  import type { Config } from "./config.js";
  import Text from "./text.svelte";

  const ctx = getFormContext();

  const config: Config = $derived({
    path: createPseudoPath(ctx, ctx[FORM_ROOT_PATH], "submit"),
    title: "",
    schema: ctx[FORM_SCHEMA],
    uiSchema: ctx[FORM_UI_SCHEMA],
    required: false,
  });

  const Button = $derived(getComponent(ctx, "submitButton", config));
</script>

<Button {config}>
  <Text {config} id="submit" translate={retrieveTranslate(ctx, config)} />
</Button>

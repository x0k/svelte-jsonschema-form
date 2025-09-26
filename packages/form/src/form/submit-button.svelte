<script lang="ts">
  import { FORM_ROOT_ID, FORM_SCHEMA, FORM_UI_SCHEMA } from "./internals.js";
  import {
    createPseudoId,
    getComponent,
    getFormContext,
    retrieveTranslate,
  } from "./state/index.js";
  import type { Config } from "./config.js";
  import Text from "./text.svelte";

  const ctx = getFormContext();

  const config: Config = $derived({
    id: createPseudoId(ctx, ctx[FORM_ROOT_ID], "submit"),
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

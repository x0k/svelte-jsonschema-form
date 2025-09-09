<script lang="ts">
  import { FORM_SCHEMA, FORM_UI_SCHEMA } from "./internals.js";
  import {
    getComponent,
    getFormContext,
    retrieveTranslate,
  } from "./state/index.js";
  import type { Config } from "./config.js";
  import Text from "./text.svelte";
  import type { Id } from "./id.js";

  const ctx = getFormContext();

  const config: Config = $derived({
    id: ctx.idPrefix as Id,
    name: "submit-button",
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

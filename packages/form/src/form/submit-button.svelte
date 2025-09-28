<script lang="ts">
  import { FORM_SCHEMA, FORM_UI_SCHEMA } from "./internals.js";
  import {
    getComponent,
    getFormContext,
    idFromPath,
    retrieveTranslate,
  } from "./state/index.js";
  import type { Config } from "./config.js";
  import Text from "./text.svelte";
  import { encodePseudoElement } from "./id.js";

  const ctx = getFormContext();

  const path = [encodePseudoElement("submit")];
  const config: Config = $derived({
    id: idFromPath(ctx, path),
    path,
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

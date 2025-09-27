<script lang="ts">
  import { FORM_ROOT_ID, FORM_SCHEMA, FORM_UI_SCHEMA, FORM_VALUE } from "./internals.js";
  import type { Config } from "./config.js";
  import {
    retrieveSchema,
    getFormContext,
    getFieldComponent,
    retrieveUiOption,
    uiTitleOption,
    retrieveTranslate,
  } from "./state/index.js";

  const ctx = getFormContext();

  const retrievedSchema = $derived(
    retrieveSchema(ctx, ctx[FORM_SCHEMA], ctx[FORM_VALUE])
  );
  const config: Config = $derived({
    id: ctx[FORM_ROOT_ID],
    path: [],
    title:
      uiTitleOption(ctx, ctx[FORM_UI_SCHEMA]) ?? retrievedSchema.title ?? "",
    schema: retrievedSchema,
    uiSchema: ctx[FORM_UI_SCHEMA],
    required: false,
  });

  const Field = $derived(getFieldComponent(ctx, config));
</script>

<Field
  type="field"
  bind:value={ctx[FORM_VALUE] as undefined}
  {config}
  uiOption={(opt) => retrieveUiOption(ctx, config, opt)}
  translate={retrieveTranslate(ctx, config)}
/>

<script lang="ts">
  import type { Config } from "./config.js";
  import type { UiSchema } from "./ui-schema.js";
  import { FAKE_ID_SCHEMA } from "./id-schema.js";
  import { isDisabledOrReadonly } from "./is-disabled-or-readonly.js";
  import { getFormContext } from "./context.js";
  import { getComponent } from "./component.js";
  import { NO_ERRORS } from './errors.js';
  import { getUiOptions } from "./utils.js";

  const ctx = getFormContext();

  const uiSchema: UiSchema = $derived(ctx.uiSchema.submitButton ?? {});
  const uiOptions = $derived(getUiOptions(ctx, uiSchema));

  const config: Config = $derived({
    name: "submit-button",
    title: "",
    idSchema: FAKE_ID_SCHEMA,
    schema: {},
    uiSchema,
    uiOptions,
    required: false,
  });

  const Button = $derived(getComponent(ctx, "button", config));
  const label = $derived(uiOptions?.title ?? ctx.translation("submit"));

  const disabledOrReadonly = $derived(
    isDisabledOrReadonly(ctx, uiOptions?.button)
  );
</script>

<Button
  type="submit"
  {config}
  attributes={uiOptions?.button}
  disabled={disabledOrReadonly}
  errors={NO_ERRORS}
>
  {label}
</Button>

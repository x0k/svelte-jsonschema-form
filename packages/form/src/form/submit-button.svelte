<script lang="ts">
  import type { Config } from "./config.js";
  import type { UiSchema } from "./ui-schema.js";
  import { FAKE_ID_SCHEMA } from "./id-schema.js";
  import { isDisabled } from "./is-disabled.js";
  import { getFormContext } from "./context.js";
  import { getComponent } from "./component.js";
  import { NO_ERRORS } from "./errors.js";
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
  const icon = $derived(ctx.icons.submit);

  const disabled = $derived(isDisabled(ctx, uiOptions?.button));
</script>

<Button
  type="submit"
  {config}
  {disabled}
  attributes={uiOptions?.button}
  errors={NO_ERRORS}
>
  {#if icon}
    {@render icon(["submit"])}
  {:else}
    {label}
  {/if}
</Button>

<script lang="ts">
  import { isDisabledOrReadonly } from "./fields/is-disabled-or-readonly";
  import type { Config } from "./config";
  import type { UiSchema } from "./ui-schema";
  import { FAKE_ID_SCHEMA } from "./id-schema";
  import { getFormContext } from "./context";
  import { getComponent } from "./component";
  import { getUiOptions } from "./utils";

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
>
  {label}
</Button>

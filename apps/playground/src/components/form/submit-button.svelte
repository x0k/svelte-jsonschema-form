<script lang="ts">
  import type { UiSchema } from "./ui-schema";
  import { getFormContext } from "./context";
  import { getComponentProps, getComponent, getUiOptions } from "./utils";

  const ctx = getFormContext();
  const uiSchema: UiSchema = $derived({
    "ui:options": ctx.uiSchema["ui:options"]?.submitButton,
  });
  const uiOptions = $derived(getUiOptions(ctx, uiSchema));
  const Button = $derived(getComponent(ctx, "button", uiSchema));
  const label = $derived(uiOptions?.title ?? ctx.translation("submit"));
</script>

<Button type="submit" {...getComponentProps(ctx, uiOptions)}>
  {label}
</Button>

<script lang="ts">
  import type { UiSchema } from "./ui-schema";
  import { getFormContext } from "./context";
  import { getComponentProps, getComponent } from "./utils";

  const ctx = getFormContext();
  const uiSchema: UiSchema = $derived({
    "ui:options": ctx.uiSchema["ui:options"]?.submitButton,
  });
  const Button = $derived(getComponent(ctx, "button", uiSchema));
  const label = $derived(uiSchema["ui:options"]?.title ?? ctx.translator("submit"));
</script>

<Button type="submit" {...getComponentProps(ctx, uiSchema)}>
  {label}
</Button>

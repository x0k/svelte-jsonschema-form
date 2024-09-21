<script lang="ts">
  import type { UiSchema } from "./ui-schema";
  import { getFormContext } from "./context";
  import { getAttributes, getComponent, getTitle } from "./utils";

  const ctx = getFormContext();
  const uiSchema: UiSchema = $derived({
    "ui:options": ctx.uiSchema["ui:options"]?.submitButton,
  });
  const Button = $derived(getComponent(ctx, "button", uiSchema));
  const label = $derived(getTitle({}, uiSchema) ?? ctx.translator("submit"));
</script>

<Button type="submit" {...getAttributes(ctx, uiSchema)}>
  {label}
</Button>

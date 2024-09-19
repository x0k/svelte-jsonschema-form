<script lang="ts">
  import type { UiSchema } from "./ui-schema";
  import { getFormContext } from "./context.svelte";
  import { getAttributes, getComponent, getTitle } from "./utils";

  const ctx = getFormContext();

  const submitButtonUiSchema: UiSchema = $derived({
    "ui:options": ctx.uiSchema["ui:options"]?.submitButton ?? {},
  });
  const options = $derived({ schema: {}, uiSchema: submitButtonUiSchema });
  const Button = $derived(getComponent(ctx, "button", options));
  const content = $derived(getTitle(options, ctx.translator("submit")));
</script>

<Button type="submit" {...getAttributes(ctx, options)}>
  {content}
</Button>

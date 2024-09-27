<script lang="ts">
  import type { HTMLButtonAttributes } from 'svelte/elements';

  import type { UiSchema } from "./ui-schema";
  import { getFormContext } from "./context";
  import { getComponent, getUiOptions } from "./utils";
  import { isDisabledOrReadonly } from './fields/is-disabled-or-readonly';

  const ctx = getFormContext();
  const uiSchema: UiSchema = $derived(ctx.uiSchema.submitButton ?? {});
  const uiOptions = $derived(getUiOptions(ctx, uiSchema));
  const Button = $derived(getComponent(ctx, "button", uiSchema));
  const label = $derived(uiOptions?.title ?? ctx.translation("submit"));
  const disabledOrReadonly = $derived(isDisabledOrReadonly(ctx, uiOptions?.input));
</script>

<Button type="submit" attributes={uiOptions?.input as HTMLButtonAttributes} disabled={disabledOrReadonly} >
  {label}
</Button>

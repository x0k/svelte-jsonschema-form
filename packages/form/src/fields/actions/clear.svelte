<script lang="ts" module>
  import type { Ref } from "@/lib/svelte.svelte.js";
  import {
    getComponent,
    isDisabled,
    retrieveTranslate,
    Text,
    type Config,
    type FieldErrors,
    type FormState,
    type SchemaValue,
  } from "@/form/index.js";

  import "@/form/extra-labels/clear.js";

  declare module "../components.js" {
    interface ButtonTypes {
      "clear-action": {};
    }
  }

  export { clear };
</script>

{#snippet clear(
  ctx: FormState<unknown>,
  config: Config,
  valueRef: Ref<SchemaValue | undefined>,
  errors: FieldErrors
)}
  {@const Button = getComponent(ctx, "button", config)}
  <Button
    type="clear-action"
    {config}
    disabled={config.schema.readOnly || isDisabled(ctx)}
    {errors}
    onclick={() => {
      valueRef.current = undefined;
    }}
  >
    <Text id="clear" {config} translate={retrieveTranslate(ctx, config)} />
  </Button>
{/snippet}

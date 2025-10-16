<script lang="ts" module>
  import type { Ref } from "@/lib/svelte.svelte.js";
  import {
    getComponent,
    retrieveTranslate,
    Text,
    type Config,
    type FieldErrors,
    type FormState,
    type SchemaValue,
  } from "@/form/index.js";
  import { isNil } from "@/lib/types.js";

  declare module "../../form/index.js" {
    interface FieldActionTypes {
      clearEdit: SchemaValue | undefined;
    }
    interface Labels {
      edit: {};
      clear: {};
    }
  }
  declare module "../components.js" {
    interface ButtonTypes {
      "clear-edit-action": {};
    }
  }

  export { clearEdit };
</script>

{#snippet clearEdit(
  ctx: FormState<unknown>,
  config: Config,
  valueRef: Ref<SchemaValue | undefined>,
  errors: FieldErrors
)}
  {@const Button = getComponent(ctx, "button", config)}
  <Button
    type="clear-edit-action"
    {config}
    disabled={false}
    {errors}
    onclick={() => {}}
  >
    <Text
      id={isNil(valueRef.current) ? "clear" : "edit"}
      {config}
      translate={retrieveTranslate(ctx, config)}
    />
  </Button>
{/snippet}

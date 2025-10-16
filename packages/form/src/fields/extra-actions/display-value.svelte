<script lang="ts" module>
  import type { Ref } from "@/lib/svelte.svelte.js";
  import type { Config, SchemaValue, FormState } from "@/form/index.js";
  import { isNil } from "@/lib/types.js";

  declare module "../../form/index.js" {
    interface FieldActionTypes {
      displayPrimitiveValue: Exclude<SchemaValue, object> | undefined;
    }
  }

  export { displayPrimitiveValue };
</script>

{#snippet displayPrimitiveValue(
  _: FormState<unknown>,
  _1: Config,
  valueRef: Ref<Exclude<SchemaValue, object> | undefined>
)}
  {#if !isNil(valueRef.current)}
    <span>{valueRef.current}</span>
  {/if}
{/snippet}

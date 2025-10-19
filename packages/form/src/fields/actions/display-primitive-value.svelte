<script lang="ts" module>
  import type { Ref } from "@/lib/svelte.svelte.js";
  import type { Config, SchemaValue, FormState } from "@/form/index.js";
  import { isNil } from "@/lib/types.js";

  export { displayPrimitiveValue };
</script>

{#snippet displayPrimitiveValue(
  _: FormState<unknown>,
  _1: Config,
  valueRef: Ref<Exclude<SchemaValue, object> | undefined>
)}
  {#if !isNil(valueRef.current)}
    <span data-display-primitive-value-action>{valueRef.current}</span>
  {/if}
{/snippet}

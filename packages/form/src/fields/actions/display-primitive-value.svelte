<script lang="ts" module>
  import type { Config, FormState, SchemaValue } from "@/form/index.js";
  import type { Ref } from "@/lib/svelte.svelte.js";
  import { isNil } from "@/lib/types.js";

  export type { displayPrimitiveValue };
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

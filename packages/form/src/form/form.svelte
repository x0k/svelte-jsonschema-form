<script lang="ts" generics="T, E">
  import { SvelteMap } from "svelte/reactivity";
  import { untrack } from "svelte";

  import { DefaultMerger, type SchemaValue } from "@/core/index.js";

  import FormBase, { type Props } from "./form-base.svelte";

  let {
    value = $bindable(),
    form = $bindable(),
    isSubmitted = $bindable(false),
    errors = $bindable(new SvelteMap()),
    schema,
    validator,
    merger,
    ...rest
  }: Props<T, E> = $props();

  const reactiveMerger = $derived(merger ?? new DefaultMerger(validator, schema));

  $effect(() => {
    schema;
    value = untrack(() =>
      reactiveMerger.mergeFormDataAndSchemaDefaults(
        value as SchemaValue | undefined,
        schema
      ) as T
    );
  });

  let base: FormBase<T, E>;

  export function validate() {
    return base.validate();
  }
</script>

<FormBase
  {...rest}
  bind:this={base}
  bind:value
  bind:form
  bind:isSubmitted
  bind:errors
  {validator}
  {schema}
  merger={reactiveMerger}
/>

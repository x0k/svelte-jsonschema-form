<script lang="ts" generics="T, E">
  import { SvelteMap } from "svelte/reactivity";
  import { untrack } from "svelte";

  import { defaultMerger, type SchemaValue } from "@/core/index.js";

  import FormBase, { type Props } from "./form-base.svelte";
  import { getDefaultFormState2 } from "./get-default-form-state.js";

  let {
    value = $bindable(),
    form = $bindable(),
    isSubmitted = $bindable(false),
    errors = $bindable(new SvelteMap()),
    merger = defaultMerger,
    ...rest
  }: Props<T, E> = $props();

  $effect(() => {
    rest.schema;
    value = untrack(
      () =>
        getDefaultFormState2(
          rest.validator,
          merger,
          rest.schema,
          value as SchemaValue | undefined
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
  {merger}
/>

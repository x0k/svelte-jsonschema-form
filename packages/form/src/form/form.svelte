<script lang="ts" generics="T, E">
  import { SvelteMap } from "svelte/reactivity";
  import { untrack } from "svelte";

  import type { SchemaValue } from "@/core/schema.js";

  import FormBase, { type Props } from "./form-base.svelte";
  import { getDefaultFormState } from "./get-default-form-state.js";

  let {
    value = $bindable(),
    form = $bindable(),
    isSubmitted = $bindable(false),
    errors = $bindable(new SvelteMap()),
    ...rest
  }: Props<T, E> = $props();

  $effect(() => {
    rest.schema;
    value = untrack(
      () =>
        getDefaultFormState(
          rest.validator,
          rest.schema,
          value as SchemaValue | undefined
        ) as T
    );
  });

  let base: FormBase<T, E>

  export function validate() {
    return base.validate()
  }
</script>

<FormBase bind:this={base} bind:value bind:form bind:isSubmitted bind:errors {...rest} />

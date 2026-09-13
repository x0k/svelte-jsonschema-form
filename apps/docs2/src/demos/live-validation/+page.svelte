<script lang="ts">
  import {
    createForm,
    BasicForm,
    hasFieldStateByPath,
    type Schema,
    FIELD_INTERACTED,
    updateErrors,
    validateFormValue,
  } from "@sjsf/form";
  import { untrack } from "svelte";

  import { getDemoContext } from "@/lib/demo";

  const { defaults } = getDemoContext();

  const schema: Schema = {
    title: "Live validation",
    properties: {
      foo: {
        type: "string",
        minLength: 10,
      },
      bar: {
        type: "number",
        minimum: 1000,
      },
    },
  };

  const form = createForm({
    ...defaults,
    initialValue: {
      foo: "initial",
      bar: 1,
    },
    schema,
    onValid: console.log,
  });

  $effect(() => {
    // NOTE: `validateFormValue()` reads the state snapshot,
    // causing `$effect` to subscribe to all changes.
    const { errors = [] } = validateFormValue(form);
    updateErrors(
      form,
      untrack(() =>
        errors.filter((e) =>
          hasFieldStateByPath(form, e.path, FIELD_INTERACTED)
        )
      )
    );
  });
</script>

<BasicForm {form} />

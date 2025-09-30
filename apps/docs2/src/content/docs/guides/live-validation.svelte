<script lang="ts">
  import { untrack } from "svelte";
  import {
    createForm,
    BasicForm,
    hasFieldStateByPath,
    type Schema,
    FIELD_INTERACTED,
    updateErrors,
    validate,
  } from "@sjsf/form";

  import * as defaults from "@/lib/form/defaults";

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
    onSubmit: console.log,
  });

  $effect(() => {
    // NOTE: `validate()` reads the state snapshot,
    // causing `$effect` to subscribe to all changes.
    const errors = validate(form);
    untrack(() =>
      updateErrors(
        form,
        errors.filter((e) =>
          hasFieldStateByPath(form, e.path, FIELD_INTERACTED)
        )
      )
    );
  });
</script>

<BasicForm {form} />

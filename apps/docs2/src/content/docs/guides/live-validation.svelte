<script lang="ts">
  import { untrack } from "svelte";
  import {
    createForm,
    BasicForm,
    hasFieldState,
    type Schema,
    FIELD_INTERACTED,
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
    // NOTE: `validate` reads the state snapshot,
    // causing `$effect` to subscribe to all changes.
    const formErrors = form.validate();
    untrack(() => {
      form.errors.clear();
      for (const [id, errors] of formErrors) {
        if (!hasFieldState(form, id, FIELD_INTERACTED)) {
          continue;
        }
        form.errors.set(id, errors);
      }
    });
  });
</script>

<BasicForm {form} />

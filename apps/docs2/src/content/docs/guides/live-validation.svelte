<script lang="ts">
  import { createForm, BasicForm, type Schema } from "@sjsf/form";
  import { resolver } from "@sjsf/form/resolvers/basic";
  import { translation } from "@sjsf/form/translations/en";
  import { createFormMerger } from "@sjsf/form/mergers/modern";
  import { createFormValidator } from "@sjsf/ajv8-validator";
  import { theme } from "@sjsf/basic-theme";

  const schema: Schema = {
    type: "string",
    minLength: 10,
  };

  const form = createForm({
    theme,
    initialValue: "initial",
    schema,
    resolver,
    translation,
    onSubmit: console.log,
    createValidator: createFormValidator,
    createMerger: createFormMerger,
  });

  $effect(() => {
    // NOTE: `validate` reads the state snapshot,
    // causing `$effect` to subscribe to all changes.
    form.errors = form.validate()
  });
</script>

<BasicForm {form} />
